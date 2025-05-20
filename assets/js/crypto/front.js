import { login, pythonURI, javaURI, fetchOptions } from '../api/config.js';

console.log("front.js is loaded.");

let userEmail = "";
let userBalance = localStorage.getItem("userBalance");

// Define showNotification globally at the top of your script
window.showNotification = function (message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};

async function fetchUser() {
  console.log("Attempting to fetch user...");
  try {
    const response = await fetch(javaURI + `/api/person/get`, fetchOptions);
    console.log("User fetch response status:", response.status);
    if (response.ok) {
      const userInfo = await response.json();
      userEmail = userInfo.email;
      console.log("Successfully fetched user email:", userEmail);
      localStorage.setItem("userEmail", userEmail);
      fetchUserBalance(); // Fetch balance after getting the email
    } else if (response.status === 401 || response.status === 201) {
      console.log("Guest user detected");
      document.getElementById('user-balance').innerText = "0.00";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

function updateBalance(balance) {
  const balanceElement = document.getElementById('user-balance');
  if (balanceElement) {
    const formattedBalance = parseFloat(balance).toFixed(2);
    balanceElement.innerText = formattedBalance;
    localStorage.setItem("userBalance", formattedBalance);
  }
}

async function fetchUserBalance() {
  console.log("Attempting to fetch balance for email:", userEmail);
  if (!userEmail) {
    console.error("User email not found, skipping balance fetch.");
    return;
  }
  try {
    const balanceUrl = `${javaURI}/api/mining/mining-status`;
    console.log("Fetching balance from:", balanceUrl);
    const response = await fetch(balanceUrl, fetchOptions);
    console.log("Balance fetch response status:", response.status);
    if (!response.ok) throw new Error(`Failed to fetch balance: ${response.status}`);
    const balanceData = await response.json();
    console.log("Received balance data:", balanceData);
    updateBalance(balanceData.userBalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    document.getElementById('user-balance').innerText = "Error";
  }
}

// Update balance every 5 seconds
setInterval(fetchUserBalance, 5000);

// Initial fetch
fetchUser();

// Make functions globally available
window.openActiveGPUsModal = function () {
  const modal = document.getElementById('active-gpus-modal');
  modal.classList.remove('hidden');
  updateActiveGPUsList();
};

window.closeActiveGPUsModal = function () {
  const modal = document.getElementById('active-gpus-modal');
  modal.classList.add('hidden');
};

function updateActiveGPUsList() {
  const container = document.getElementById('active-gpus-list');
  container.innerHTML = '';
  if (!window.stats || !window.stats.gpus) {
    container.innerHTML = '<p class="text-gray-400 text-center">No active GPUs found</p>';
    return;
  }

  const gpuGroups = {};
  window.stats.gpus.forEach(gpu => {
    if (gpu.isActive) {
      if (!gpuGroups[gpu.id]) {
        gpuGroups[gpu.id] = {
          ...gpu,
          quantity: gpu.quantity || 0,
          hashrate: gpu.hashrate || 0,
          power: gpu.power || 0,
          temp: gpu.temp || 0
        };
      }
    }
  });

  if (Object.keys(gpuGroups).length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center">No active GPUs found</p>';
    return;
  }

  Object.values(gpuGroups).forEach(gpu => {
    const card = document.createElement('div');
    card.className = 'gpu-card';
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-blue-400">${gpu.name || 'Unknown GPU'}</h3>
            <span class="text-green-400 text-lg font-bold">x${gpu.quantity}</span>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-gray-400 mb-2">Performance (Per GPU)</p>
              <div class="space-y-2">
                <p class="text-white">⚡ ${gpu.hashrate.toFixed(2)} MH/s</p>
                <p class="text-white">🔌 ${gpu.power}W</p>
                <p class="text-white">🌡️ ${gpu.temp}°C</p>
                <p class="text-white">📊 ${(gpu.hashrate / gpu.power).toFixed(3)} MH/W</p>
              </div>
            </div>
            <div>
              <p class="text-gray-400 mb-2">Total Output</p>
              <div class="space-y-2">
                <p class="text-white">⚡ ${(gpu.hashrate * gpu.quantity).toFixed(2)} MH/s</p>
                <p class="text-white">🔌 ${gpu.power * gpu.quantity}W</p>
                <p class="text-emerald-400">✅ All Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Make toggleMining globally available
window.toggleMining = async function () {
  try {
    const options = {
      ...fetchOptions,
      method: 'POST',
      cache: 'no-cache'
    };
    const response = await fetch(`${javaURI}/api/mining/toggle`, options);
    const result = await response.json();
    console.log('Mining toggle result:', result);

    updateMiningButton(result.isMining);
    if (result.isMining) {
      startPeriodicUpdates();
      showNotification('Mining started successfully');
    } else {
      stopPeriodicUpdates();
      showNotification('Mining stopped');
    }
    await updateMiningStats();
  } catch (error) {
    console.error('Error toggling mining:', error);
    showNotification('Error toggling mining state');
  }
};

let hashrateChart, profitChart;
let updateInterval;

// Initialize charts and setup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    initializeCharts();
    setupEventListeners();
    await initializeMiningState();
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

function setupEventListeners() {
  document.getElementById('gpu-shop').addEventListener('click', openGpuShop);
}

function initializeCharts() {
  const hashrateCtx = document.getElementById('hashrate-chart').getContext('2d');
  hashrateChart = new Chart(hashrateCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Hashrate (MH/s)',
        data: [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x'
          },
          pan: { enabled: true }
        }
      }
    }
  });

  const profitCtx = document.getElementById('profit-chart').getContext('2d');
  profitChart = new Chart(profitCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Profit (USD)',
        data: [],
        borderColor: '#BE0102',
        backgroundColor: 'rgba(190, 1, 2, 0.2)',
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x'
          },
          pan: { enabled: true }
        }
      }
    }
  });
}
async function initializeMiningState() {
    try {
        const options = {
            ...fetchOptions,
            method: 'GET',
            cache: 'no-cache'
        };
        // Fetch initial mining state
        const response = await fetch(`${javaURI}/api/mining/state`, options);
        if (!response.ok) {
            throw new Error('Failed to fetch mining state');
        }
        const state = await response.json();
        console.log('Initial mining state:', state);
        // Update UI with initial state
        updateDisplay(state);
        updateMiningButton(state.isMining);
        // Start periodic updates if mining is active
        if (state.isMining) {
            startPeriodicUpdates();
        }
    } catch (error) {
        console.error('Error initializing mining state:', error);
        showNotification('Error loading mining state. Please try again.');
    }
}
async function startPeriodicUpdates() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(async () => {
        await updateMiningStats();
    }, 5000);
    const options = {
        ...fetchOptions,
        method: 'GET',
        cache: 'no-cache'
    };
    // Real time monitor
    setInterval(async () => {
        try {
            const response = await fetch(`${javaURI}/api/mining/stats`, options);
            const stats = await response.json();
            console.log('Real time monitor:', {
                time: new Date().toLocaleTimeString(),
                pending: stats.pendingBalance,
                hashrate: stats.hashrate,
                activeGPUs: stats.activeGPUs?.length || 0
            });
        } catch (error) {
            console.error('Real time monitor **FAILED**:', error);
        }
    }, 5000);
}
// API Calls
async function loadGPUs() {
    try {
        const options = {
            ...fetchOptions,
            method: 'GET',
            cache: 'no-cache'
        };
        const response = await fetch(`${javaURI}/api/mining/shop`, options);
        const gpus = await response.json();
        console.log('GPUs:', gpus); // Log the GPUs to check the structure
        renderGpuShop(gpus);
    } catch (error) {
        console.error('Error loading GPUs:', error);
    }
}
window.toggleGPU = async function (gpuId) {
    try {
        const options = {
            ...fetchOptions,
            method: 'POST',
            cache: 'no-cache'
        };
        const response = await fetch(`${javaURI}/api/mining/gpu/toggle/${gpuId}`, options);
        const result = await response.json();
        if (result.success) {
            showNotification(result.message);
            // 局部更新GPU卡片
            const gpuCard = document.querySelector(`[data-gpu-id="${gpuId}"]`);
            if (gpuCard) {
                const button = gpuCard.querySelector('button');
                button.innerHTML = `
                            <span class="text-lg">${result.isActive ? '⏸️' : '▶️'}</span>
                            ${result.isActive ? 'Deactivate' : 'Activate'}
                        `;
                button.className = `w-full ${result.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                            px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2`;
            }
            await updateMiningStats();
        } else {
            showNotification(result.message || 'Failed to toggle GPU');
        }
    } catch (error) {
        console.error('Error toggling GPU:', error);
        showNotification('Error toggling GPU: ' + error.message);
    }
}
window.buyGpu = async function (gpuId, quantity) {
    try {
        const options = {
            ...fetchOptions,
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({ quantity: quantity })
        };
        const response = await fetch(`${javaURI}/api/mining/gpu/buy/${gpuId}`, options);
        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
            await updateMiningStats();
            await loadGPUs();
        } else {
            showNotification(result.message || 'Failed to buy GPU');
        }
    } catch (error) {
        console.error('Error buying GPU:', error);
        showNotification('Error buying GPU: ' + error.message);
    }
}
async function updateMiningStats() {
    // Get current cryptocurrency from localStorage or default to BTC
    let currentSymbol = localStorage.getItem('currentMiningCrypto') || 'BTC';
    // Update the pool info with the current cryptocurrency
    document.getElementById('pool-info').textContent = `Mining: ${currentSymbol}`;
    try {
        const options = {
            ...fetchOptions,
            method: 'GET',
            cache: 'no-cache'
        };
        
        // First fetch the stats
        const statsResponse = await fetch(`${javaURI}/api/mining/stats`, options);
        if (!statsResponse.ok) {
            throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
        }
        const stats = await statsResponse.json();
        
        // Try to fetch GPU shop data, but don't fail if it errors
        let gpuPriceMap = {};
        try {
            const gpusResponse = await fetch(`${javaURI}/api/mining/shop`, options);
            if (gpusResponse.ok) {
                const gpus = await gpusResponse.json();
                console.log('Shop GPUs:', gpus);
                // Create a map of GPU prices
                gpus.forEach(gpu => {
                    gpuPriceMap[gpu.id] = gpu.price;
                    console.log(`GPU ${gpu.id} (${gpu.name}) price: ${gpu.price}`);
                });
            } else {
                console.warn('Failed to fetch GPU shop data:', gpusResponse.status);
            }
        } catch (shopError) {
            console.warn('Error fetching GPU shop data:', shopError);
        }
        
        // Add prices to the stats.gpus array
        if (stats.gpus) {
            stats.gpus = stats.gpus.map(gpu => {
                const price = gpuPriceMap[gpu.id] || gpu.price || 0; // Use existing price if available
                console.log(`Merging GPU ${gpu.id} (${gpu.name}) with price: ${price}`);
                return {
                    ...gpu,
                    price: price
                };
            });
        } else {
            stats.gpus = [];
        }
        
        console.log('Final Stats GPUs with Prices:', stats.gpus);
        
        updateDisplay(stats);
        renderGpuInventory(stats);
        updateCharts(stats);
    } catch (error) {
        console.error('Error updating mining stats:', error);
        showNotification('Failed to fetch mining data, check your connection');
    }
}
// UI Updates
function updateDisplay(stats) {
    // Log incoming data
    console.log('Updating display with stats:', stats);
    // Parse BTC values
    const btcBalance = parseFloat(stats.btcBalance) || 0;
    const pendingBalance = parseFloat(stats.pendingBalance) || 0;
    const totalBTC = btcBalance + pendingBalance;
    // Update BTC displays
    document.getElementById('btc-balance').textContent = btcBalance.toFixed(8);
    document.getElementById('pending-balance').textContent = pendingBalance.toFixed(8);
    // Calculate and update USD value
    let usdValue;
    if (stats.totalBalanceUSD) {
        // Use API-provided USD value if available
        usdValue = stats.totalBalanceUSD;
    } else {
        // Calculate USD value using BTC_PRICE constant
        usdValue = (totalBTC * 45000).toFixed(2);
    }
    document.getElementById('usd-value').textContent = `$${usdValue}`;
    // Log the values being displayed
    console.log('Display values:', {
        btcBalance: btcBalance.toFixed(8),
        pendingBalance: pendingBalance.toFixed(8),
        totalBTC: totalBTC.toFixed(8),
        usdValue: usdValue
    });
    // Add small random fluctuations to temperature and power
    const tempVariation = Math.random() * 2 - 1; // Random variation ±1°C
    const powerVariation = Math.random() * 10 - 5; // Random variation ±5W
    // Get base values
    const baseTemp = parseFloat(stats.averageTemperature) || 0;
    const basePower = parseFloat(stats.powerConsumption) || 0;
    // Calculate new values with fluctuations
    const newTemp = Math.max(30, Math.min(90, baseTemp + tempVariation)); // Keep between 30-90°C
    const newPower = Math.max(0, basePower + powerVariation); // Keep above 0W
    // Update display elements
    document.getElementById('hashrate').textContent = `${(parseFloat(stats.hashrate) || 0).toFixed(2)} MH/s`;
    document.getElementById('shares').textContent = stats.shares || 0;
    document.getElementById('gpu-temp').textContent = `${newTemp.toFixed(1)}°C`;
    document.getElementById('power-draw').textContent = `${newPower.toFixed(0)}W`;
    document.getElementById('daily-revenue').textContent = `$${(typeof stats.dailyRevenue === 'number' ? stats.dailyRevenue : 0).toFixed(2)}`;
    document.getElementById('power-cost').textContent = `$${(typeof stats.powerCost === 'number' ? stats.powerCost : 0).toFixed(2)}`;
    // Update GPU count display
    if (stats.gpus && stats.gpus.length > 0) {
        const totalGPUs = stats.gpus.reduce((sum, gpu) => sum + gpu.quantity, 0);
        const activeGPUs = stats.gpus.reduce((sum, gpu) => gpu.isActive ? sum + gpu.quantity : sum, 0);
        document.getElementById('current-gpu').textContent =
            `${activeGPUs} Active of ${totalGPUs} GPUs (Click to view)`;
    } else {
        document.getElementById('current-gpu').textContent = 'No GPUs';
    }
    // Add color indicators for temperature
    const tempElement = document.getElementById('gpu-temp');
    if (newTemp >= 80) {
        tempElement.className = 'stat-value text-red-500'; // Hot
    } else if (newTemp >= 70) {
        tempElement.className = 'stat-value text-yellow-500'; // Warm
    } else {
        tempElement.className = 'stat-value text-green-500'; // Good
    }
    // Store stats globally for modal access
    window.stats = stats;
}
function renderGpuInventory(stats) {
    const inventoryElement = document.getElementById('gpu-inventory');
    if (!inventoryElement) return;
    inventoryElement.innerHTML = '';
    const gpus = stats?.gpus || [];
    if (!gpus.length) {
        inventoryElement.innerHTML = '<p class="text-gray-400 text-center">No GPUs in inventory</p>';
        return;
    }
    // Create gpuGroups object to group GPUs by ID
    const gpuGroups = {};
    gpus.forEach(gpu => {
        const gpuId = gpu.id;
        if (!gpuGroups[gpuId]) {
            gpuGroups[gpuId] = {
                ...gpu,
                quantity: gpu.quantity || 0,
                activeCount: gpu.isActive ? (gpu.quantity || 0) : 0
            };
        }
    });
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4';
    Object.values(gpuGroups).forEach(gpu => {
        const gpuCard = document.createElement('div');
        gpuCard.className = 'bg-gray-800 rounded-xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] border border-gray-700';
        gpuCard.dataset.gpuId = gpu.id;
        // Fix property names to match the backend data
        const hashrate = parseFloat(gpu.hashrate) || 0;
        const power = parseFloat(gpu.power) || 0;
        const temp = parseFloat(gpu.temp) || 0;
        const price = parseFloat(gpu.price) || 0;
        const dailyRevenue = hashrate * 86400 * 0.00000001;
        const dailyPowerCost = (power * 24 / 1000 * 0.12);
        const dailyProfit = dailyRevenue - dailyPowerCost;
        const sellPrice = (price * 0.8).toFixed(2); // Calculate 80% of original price
        gpuCard.innerHTML = `
                    <div class="flex flex-col h-full">
                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <h3 class="text-xl font-bold text-white">${gpu.name}</h3>
                                <span class="text-green-400 text-lg font-bold">x${gpu.quantity}</span>
                            </div>
                            <p class="text-blue-400 text-sm mb-4">${gpu.activeCount} of ${gpu.quantity} Active</p>
                            <div class="grid grid-cols-2 gap-4 mt-2">
                                <div class="text-sm">
                                    <p class="text-gray-400">Performance (Per GPU)</p>
                                    <p class="text-white">⚡ ${hashrate.toFixed(2)} MH/s</p>
                                    <p class="text-white">🔌 ${power.toFixed(0)}W</p>
                                    <p class="text-white">🌡️ ${temp.toFixed(1)}°C</p>
                                </div>
                                <div class="text-sm">
                                    <p class="text-gray-400">Daily Estimates (Per GPU)</p>
                                    <p class="text-green-400">💰 $${dailyRevenue.toFixed(2)}</p>
                                    <p class="text-red-400">💡 -$${dailyPowerCost.toFixed(2)}</p>
                                    <p class="text-blue-400">📈 $${dailyProfit.toFixed(2)}</p>
                                </div>
                            </div>
                            <div class="mt-4 text-sm">
                                <p class="text-purple-400">Total Daily Profit: $${(dailyProfit * gpu.quantity).toFixed(2)}</p>
                                <p class="text-yellow-400">Sell Price: $${sellPrice} each</p>
                            </div>
                            <div class="mt-4 flex justify-end">
                                <button onclick="showSellModal(${gpu.id}, '${gpu.name}', ${gpu.quantity}, ${sellPrice})"
                                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                                    Sell GPU
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(gpuCard);
    });
    inventoryElement.appendChild(container);
}
function updateCharts(stats) {
    if (!stats) {
        console.warn('updateCharts called without stats');
        return;
    }
    console.log('Updating charts with:', {
        hashrate: stats.hashrate,
        dailyRevenue: stats.dailyRevenue,
        powerCost: stats.powerCost
    });
    const now = new Date().toLocaleTimeString();
    // Update hashrate chart
    if (hashrateChart) {
        const numericHashrate = parseFloat(stats.hashrate) || 0;
        console.log('Adding hashrate data point:', numericHashrate);
        hashrateChart.data.labels.push(now);
        hashrateChart.data.datasets[0].data.push(numericHashrate);
        if (hashrateChart.data.labels.length > 50) {
            hashrateChart.data.labels.shift();
            hashrateChart.data.datasets[0].data.shift();
        }
        hashrateChart.update('none');
        console.log('Hashrate chart updated');
    }
    // Update profit chart with total profit (Power Cost + USD Value)
    if (profitChart) {
        const dailyRevenue = typeof stats.dailyRevenue === 'number' ? stats.dailyRevenue : 0;
        const powerCost = typeof stats.powerCost === 'number' ? stats.powerCost : 0;
        const totalBalanceUSD = parseFloat(stats.totalBalanceUSD) || 0;
        const totalProfit = totalBalanceUSD + powerCost; // Add power cost to total balance
        console.log('Calculated total profit:', { dailyRevenue, powerCost, totalBalanceUSD, totalProfit });
        profitChart.data.labels.push(now);
        profitChart.data.datasets[0].data.push(totalProfit);
        if (profitChart.data.labels.length > 50) {
            profitChart.data.labels.shift();
            profitChart.data.datasets[0].data.shift();
        }
        profitChart.update('none');
        console.log('Profit chart updated');
    }
}
function updateMiningButton(isActive) {
    const button = document.getElementById('start-mining');
    if (button) {
        if (isActive) {
            button.textContent = 'Stop Mining';
            button.className = 'mining-button start-mining active';
        } else {
            button.textContent = 'Start Mining';
            button.className = 'mining-button start-mining';
        }
    } else {
        console.error('Mining button not found');
    }
}
function renderGpuShop(gpus) {
    const gpuListElement = document.getElementById('gpu-list');
    if (!gpuListElement) {
        console.error('GPU list element not found');
        return;
    }
    
    gpuListElement.innerHTML = '';
    // Group GPUs by category
    const categories = {
        'Free Starter GPU': gpus.filter(gpu => gpu.price === 0),
        'Budget GPUs ($10000-20000)': gpus.filter(gpu => gpu.price > 0 && gpu.price <= 20000),
        'Mid-Range GPUs ($20000-50000)': gpus.filter(gpu => gpu.price > 20000 && gpu.price <= 50000),
        'High-End GPUs ($50000-100000)': gpus.filter(gpu => gpu.price > 50000 && gpu.price <= 100000),
        'Premium GPUs ($100000+)': gpus.filter(gpu => gpu.price > 100000)
    };

    Object.entries(categories).forEach(([category, categoryGpus]) => {
        if (categoryGpus.length === 0) return;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = `text-xl font-bold mb-4 mt-6 ${getCategoryColor(category)}`;
        categoryHeader.textContent = category;
        gpuListElement.appendChild(categoryHeader);
        
        categoryGpus.forEach(gpu => {
            const gpuCard = createGpuCard(gpu, category);
            gpuListElement.appendChild(gpuCard);
        });
    });
}
function createGpuCard(gpu, category) {
    const card = document.createElement('div');
    card.className = `gpu-card mb-4 ${getCategoryClass(category)}`;
    // Calculate daily estimates
    const dailyRevenue = (gpu.hashRate || 0) * 86400 * 0.00000001;
    const dailyPowerCost = (gpu.powerConsumption || 0) * 24 / 1000 * 0.12;
    const dailyProfit = dailyRevenue - dailyPowerCost;
    const roi = dailyProfit > 0 ? (gpu.price / dailyProfit) : Infinity;
    // Add quantity selector for non-starter GPUs
    const isStarterGPU = gpu.price === 0;
    const quantitySelector = isStarterGPU ? '' : `
                <div class="flex flex-col items-end gap-2">
                    <div class="flex items-center">
                        <label class="text-gray-400 mr-2">Quantity:</label>
                        <select id="quantity-${gpu.id}" class="bg-gray-700 rounded px-2 py-1" 
                                data-price="${gpu.price}"
                                data-gpu-id="${gpu.id}"
                                onchange="updateTotalPrice(${gpu.id}, ${gpu.price}); updateShopTotalCost()">
                            ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="text-gray-400">
                        Total: $<span id="total-${gpu.id}">0</span>
                    </div>
                </div>
            `;
    // Show owned quantity if owned
    const ownedQuantity = gpu.quantity > 0 ?
        `<p class="text-green-400 text-sm">Owned: ${gpu.quantity}</p>` : '';
    card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold ${getCategoryColor(category)}">${gpu.name}</h3>
                        ${ownedQuantity}
                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div class="text-sm">
                                <p class="text-gray-400">Performance</p>
                                <p class="text-white">⚡ ${(gpu.hashRate || 0).toFixed(2)} MH/s</p>
                                <p class="text-white">🔌 ${(gpu.powerConsumption || 0).toFixed(0)}W</p>
                                <p class="text-white">🌡️ ${(gpu.temp || 0).toFixed(1)}°C</p>
                            </div>
                            <div class="text-sm">
                                <p class="text-gray-400">Daily Estimates</p>
                                <p class="text-green-400">💰 $${dailyRevenue.toFixed(2)}</p>
                                <p class="text-red-400">💡 -$${dailyPowerCost.toFixed(2)}</p>
                                <p class="text-blue-400">📈 $${dailyProfit.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="mt-2 text-sm">
                            <p class="text-gray-400">Efficiency: ${((gpu.hashRate || 0) / (gpu.powerConsumption || 1)).toFixed(3)} MH/W</p>
                            <p class="text-gray-400">ROI: ${roi.toFixed(1)} days</p>
                        </div>
                    </div>
                    <div class="text-right ml-4 flex flex-col items-end">
                        <p class="text-xl font-bold ${getCategoryColor(category)} mb-2">
                            ${gpu.price === 0 ? 'FREE' : '$' + gpu.price.toLocaleString()}
                        </p>
                        ${quantitySelector}
                    </div>
                </div>
            `;
    // After creating the card, attach the event listener
    setTimeout(() => {
        const quantitySelect = document.getElementById(`quantity-${gpu.id}`);
        if (quantitySelect) {
            quantitySelect.addEventListener('change', function () {
                const gpuId = this.dataset.gpuId;
                const basePrice = parseFloat(this.dataset.price);
                updateTotalPrice(gpuId, basePrice);
                updateShopTotalCost();
            });
        }
    }, 0);
    return card;
}
// Utility functions
function getCategoryColor(category) {
    const colors = {
        'Free Starter GPU': 'text-green-400',
        'Budget GPUs ($10000-20000)': 'text-blue-400',
        'Mid-Range GPUs ($20000-50000)': 'text-purple-400',
        'High-End GPUs ($50000-100000)': 'text-orange-400',
        'Premium GPUs ($100000+)': 'text-red-400'
    };
    return colors[category] || 'text-white';
}
function getCategoryClass(category) {
    const classes = {
        'Free Starter GPU': 'starter',
        'Budget GPUs ($10000-20000)': 'budget',
        'Mid-Range GPUs ($20000-50000)': 'mid-range',
        'High-End GPUs ($50000-100000)': 'high-end',
        'Premium GPUs ($100000+)': 'premium'
    };
    return classes[category] || '';
}
function openGpuShop() {
    const modal = document.getElementById('gpu-shop-modal');
    modal.classList.remove('hidden');
    loadGPUs(); // Load GPUs when opening the shop
}
window.closeGpuShop = function() {
    const modal = document.getElementById('gpu-shop-modal');
    modal.classList.add('hidden');
};
// Close modal when clicking outside
document.getElementById('gpu-shop-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gpu-shop-modal') {
        e.target.classList.add('hidden');
    }
});
function stopPeriodicUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}
// Update the total price function to properly format numbers
function updateTotalPrice(gpuId, basePrice) {
    const quantitySelect = document.getElementById(`quantity-${gpuId}`);
    const totalSpan = document.getElementById(`total-${gpuId}`);
    if (quantitySelect && totalSpan) {
        const quantity = parseInt(quantitySelect.value);
        const total = quantity > 0 ? basePrice * quantity : 0;
        totalSpan.textContent = total.toLocaleString();
    }
}
function updateShopTotalCost() {
    let total = 0;
    document.querySelectorAll('[id^="quantity-"]').forEach(select => {
        const quantity = parseInt(select.value);
        if (quantity > 0) {  // Only include if quantity is greater than 0
            const basePrice = parseFloat(select.dataset.price);
            if (!isNaN(basePrice)) {
                total += basePrice * quantity;
            }
        }
    });
    document.getElementById('shop-total-cost').textContent = total.toLocaleString();
}
// Make the functions globally available
window.updateTotalPrice = updateTotalPrice;
window.updateShopTotalCost = updateShopTotalCost;
window.buySelectedGPUs = async function () {
    const purchases = [];
    document.querySelectorAll('[id^="quantity-"]').forEach(select => {
        const quantity = parseInt(select.value);
        const gpuId = select.dataset.gpuId;
        if (quantity > 0) {
            purchases.push({ gpuId, quantity });
        }
    });
    if (purchases.length === 0) {
        showNotification('Please select at least one GPU to buy');
        return;
    }
    // Process each purchase
    for (const purchase of purchases) {
        await buyGpu(purchase.gpuId, purchase.quantity);
    }
};
// Add sell functionality
function showSellModal(gpuId, gpuName, maxQuantity, sellPrice) {
    const modal = document.getElementById('sellModal');
    const modalContent = document.getElementById('sellModalContent');
    modalContent.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 class="text-2xl font-bold text-white mb-4">Sell ${gpuName}</h2>
            <p class="text-gray-300 mb-4">Sell price: $${sellPrice} each</p>
            <div class="mb-4">
                <label class="text-gray-300 block mb-2">Quantity:</label>
                <input type="number" id="sellQuantity" 
                       min="1" max="${maxQuantity}" value="1" 
                       class="bg-gray-700 text-white px-3 py-2 rounded w-full"
                       onchange="updateSellTotal(${sellPrice})">
            </div>
            <p class="text-lg text-green-400 mb-4">
                Total value: $<span id="totalSellValue">${sellPrice}</span>
            </p>
            <div class="flex justify-end gap-4">
                <button onclick="closeSellModal()"
                        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    Cancel
                </button>
                <button onclick="confirmSell(${gpuId})"
                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Confirm Sale
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    updateSellTotal(sellPrice);
}
function updateSellTotal(sellPrice) {
    const quantity = parseInt(document.getElementById('sellQuantity').value) || 0;
    const total = (sellPrice * quantity).toFixed(2);
    document.getElementById('totalSellValue').textContent = total;
}
function closeSellModal() {
    document.getElementById('sellModal').style.display = 'none';
}
// Update the confirmSell function with proper headers
window.confirmSell = async function (gpuId) {
    const quantity = parseInt(document.getElementById('sellQuantity').value);
    try {
        const response = await fetch(`${javaURI}/api/mining/gpu/sell/${gpuId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers
            },
            credentials: 'include',
            body: JSON.stringify({ quantity: quantity })
        });
        const result = await response.json();
        if (result.success) {
            window.showNotification(result.message);
            closeSellModal();
            await updateMiningStats();
            // Update user balance
            await fetchUserBalance();
        } else {
            window.showNotification(result.message || 'Failed to sell GPU', true);
        }
    } catch (error) {
        console.error('Error selling GPU:', error);
        window.showNotification('Error selling GPU: ' + error.message, true);
    }
};
window.toggleMining = toggleMining;
window.showSellModal = showSellModal;
window.updateSellTotal = updateSellTotal;
window.closeSellModal = closeSellModal;
window.confirmSell = confirmSell;