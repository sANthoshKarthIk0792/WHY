---
layout: base
title: Energy Store
type: page
permalink: /crypto/energy-store
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Energy Store</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body>
    <div class="main-content container mx-auto mt-8">
        <!-- Page Title -->
        <h1 class="text-3xl font-bold text-center mb-4">⚡Energy Store</h1>
        <div class="text-center text-lg text-green-300 mb-6">
            Your Balance: <span id="user-balance">Loading...</span>
        </div>
        <div id="notification" class="hidden text-center"></div>
        <script type="module">
        import { login, pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
        let userEmail = "";
        let userBalance = localStorage.getItem("userBalance");
        window.showNotification = function(message, isError = false) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg`;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        };
        async function fetchUser() {
            try {
                const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
                if (response.ok) {
                    const userInfo = await response.json();
                    userEmail = userInfo.email;
                    localStorage.setItem("userEmail", userEmail);
                    fetchUserBalance();
                } else if (response.status === 401 || response.status === 201) {
                    document.getElementById('user-balance').innerText = "0.00";
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        function updateBalance(balance) {
            const formattedBalance = parseFloat(balance).toFixed(2);
            document.getElementById('user-balance').innerText = formattedBalance;
            localStorage.setItem("userBalance", formattedBalance);
        }
        async function fetchUserBalance() {
            if (!userEmail) return;
            try {
                const balanceUrl = `${javaURI}/api/mining/mining-status`;
                const response = await fetch(balanceUrl, fetchOptions);
                if (!response.ok) throw new Error(`Failed to fetch balance: ${response.status}`);
                const balanceData = await response.json();
                updateBalance(balanceData.userBalance);
            } catch (error) {
                console.error("Error fetching balance:", error);
                document.getElementById('user-balance').innerText = "Error";
            }
        }
        window.buyEnergyPlan = async function(supplierName, eem) {
            fetchUser()
            try {
                const url = `${javaURI}/api/mining/chooseEnergy/${encodeURIComponent(supplierName)}/${eem}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    alert(`Successfully purchased ${supplierName} plan (Consumes ${eem} EEM)`);
                    fetchUserBalance();
                } else {
                    const error = await response.json(); // ✅ Only call once
                    console.log(error); // ✅ Log it once
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                console.error('Error during purchase:', error);
                alert('Purchase failed. Please try again.');
            }
        };
        fetchUser();
        setInterval(fetchUserBalance, 5000);
        </script>
        <!-- Energy Store Section -->
        <div id="energy-store" class="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold text-green-400 mb-4">🛒 Available Energy Plans</h2>
            <div id="supplier-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
                <!-- Energy plan cards -->
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Tesla Energy</h3>
                    <p class="text-lg mt-2">Price: $12.99</p>
                    <p class="text-sm text-green-300">Consumes: 0.094 EEM</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onclick="buyEnergyPlan('Tesla Energy', 0.094)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Duke Energy</h3>
                    <p class="text-lg mt-2">Price: $14.49</p>
                    <p class="text-sm text-green-300">Consumes: 0.128 EEM</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onclick="buyEnergyPlan('Duke Energy', 0.128)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Pacific Gas and Electric</h3>
                    <p class="text-lg mt-2">Price: $16.25</p>
                    <p class="text-sm text-green-300">Consumes: 0.157 EEM</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onclick="buyEnergyPlan('Pacific Gas and Electric', 0.157)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">NextEra Energy</h3>
                    <p class="text-lg mt-2">Price: $18.75</p>
                    <p class="text-sm text-green-300">Consumes: 0.186 EEM</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onclick="buyEnergyPlan('NextEra Energy', 0.186)">Buy</button>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 class="text-2xl font-semibold text-green-400">Southern Company</h3>
                    <p class="text-lg mt-2">Price: $21.99</p>
                    <p class="text-sm text-green-300">Consumes: 0.219 EEM</p>
                    <button class="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onclick="buyEnergyPlan('Southern Company', 0.219)">Buy</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
