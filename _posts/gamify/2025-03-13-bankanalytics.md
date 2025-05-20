---
layout: finance
title: Bank Analytics
permalink: /gamify/bankanalytics
---
<html lang="en">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
    .chart-container {
        height: 300px;
        position: relative;
    }
    .combined-chart-container {
        height: 400px;
    }
    .game-card {
        background-color: #1f1f1f;
        border-radius: 8px;
        transition: transform 0.3s;
    }
    .game-card:hover {
        transform: translateY(-5px);
    }
    .game-title {
        color: #ff9800;
        border-left: 4px solid #ff9800;
        padding-left: 1rem;
    }
    .toggle-container {
        text-align: center;
        margin-bottom: 1rem;
    }
    .toggle-container button {
        margin: 0.2rem;
    }
</style>
<body class="m-0 p-0" style="font-family: 'Poppins', sans-serif; background-color: #121212; color: #fff;">

<br>
<h1 class="text-center">Game Analytics</h1>

<!-- Combined Chart -->
<div class="container my-4">
    <div class="game-card p-3">
        <h3 class="game-title">All Games Combined</h3>
        <div class="toggle-container">
            <button class="btn btn-sm btn-outline-warning" onclick="window.toggleDataset('Poker')">Poker</button>
            <button class="btn btn-sm btn-outline-info" onclick="window.toggleDataset('Blackjack')">Blackjack</button>
            <button class="btn btn-sm btn-outline-light" onclick="window.toggleDataset('Dice')">Dice</button>
            <button class="btn btn-sm btn-outline-primary" onclick="window.toggleDataset('Mines')">Mines</button>
        </div>
        <div class="combined-chart-container mt-3">
            <canvas id="combinedChart"></canvas>
        </div>
    </div>
</div>

<!-- Charts Grid -->
<div class="container my-4">
    <div class="row g-4">
        <div class="col-12 col-md-6 col-lg-3" id="pokerChartContainer"></div>
        <div class="col-12 col-md-6 col-lg-3" id="blackjackChartContainer"></div>
        <div class="col-12 col-md-6 col-lg-3" id="diceChartContainer"></div>
        <div class="col-12 col-md-6 col-lg-3" id="casino_minesChartContainer"></div>
    </div>
</div>

<script type="module">
import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

let userId = null;
const charts = {};
let combinedChart = null;

/**
 * Mapping of internal game keys to display labels.
 */
const gameMap = {
    poker: 'Poker',
    blackjack: 'Blackjack',
    dice: 'Dice',
    casino_mines: 'Mines'
};

/**
 * Color palette for game charts.
 */
const gameColors = {
    poker: '#FF6384',
    blackjack: '#4BC0C0',
    dice: '#FFCE56',
    casino_mines: '#9966FF'
};

/**
 * Fetch the current user's profile data and trigger chart initialization.
 * Updates DOM with UID and balance.
 */
async function fetchUserDetails() {
    try {
        const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        const userData = await response.json();
        userId = userData.id;
        document.querySelector('.name').textContent = userData.uid || "Unknown";
        document.querySelector('.balance').textContent = Number(userData.balance).toFixed(2);
        initializeCharts();
    } catch (error) {
        console.error("Error fetching user data:", error);
        document.querySelector('.name').textContent = "Error";
    }
}

/**
 * Initialize all game charts by fetching transaction history.
 */
async function initializeCharts() {
    const games = Object.keys(gameMap);

    const gameData = await Promise.all(games.map(async (game) => {
        try {
            const response = await fetch(`${javaURI}/bank/${userId}/profitmap/${game}`, {
                ...fetchOptions,
                method: 'GET'
            });
            const result = response.ok ? await response.json() : [];
            console.log(`Fetched ${game} data:`, result);
            return {
                game,
                data: result
            };
        } catch (error) {
            console.error(`Failed to fetch ${game}:`, error);
            return { game, data: [] };
        }
    }));

    gameData.forEach(({ game, data }) => {
        renderChartCard(game);
        createChart(game, data);
    });

    createCombinedChart(gameData);
}

/**
 * Render chart HTML card for an individual game.
 * @param {string} game - Game key name.
 */
function renderChartCard(game) {
    const containerId = `${game}ChartContainer`;
    document.getElementById(containerId).innerHTML = `
        <div class="game-card p-3 h-100">
            <h3 class="game-title">${gameMap[game]}</h3>
            <div class="chart-container mt-3">
                <canvas id="${game}Chart"></canvas>
            </div>
        </div>
    `;
}

/**
 * Create a line chart for a specific game using Chart.js.
 * @param {string} game - Game key.
 * @param {Array} transactions - List of [timestamp, profit] pairs.
 */
function createChart(game, transactions) {
    const processed = processChartData(game, transactions);
    if (!processed) return;
    const ctx = document.getElementById(`${game}Chart`).getContext('2d');
    if (charts[game]) charts[game].destroy();
    charts[game] = new Chart(ctx, {
        type: 'line',
        data: processed,
        options: getChartOptions(game)
    });
}

/**
 * Build a combined chart showing cumulative balances across all games.
 * @param {Array} gameData - Array of game and data pairs.
 */
function createCombinedChart(gameData) {
    const labelSet = new Set();
    gameData.forEach(({ data }) => {
        data.forEach(([date]) => {
            labelSet.add(new Date(date).toLocaleDateString());
        });
    });
    const labels = Array.from(labelSet).sort((a, b) => new Date(a) - new Date(b));

    const datasets = gameData.map(({ game, data }) => {
        const dailyMap = {};
        let cumBal = 0;

        data.forEach(([time, profit]) => {
            const key = new Date(time).toLocaleDateString();
            const value = parseFloat(profit) || 0;
            cumBal += value;
            dailyMap[key] = cumBal;
        });

        const points = labels.map(label => dailyMap[label] ?? null);

        return {
            label: gameMap[game],
            data: points,
            borderColor: gameColors[game],
            backgroundColor: `${gameColors[game]}30`,
            tension: 0.2,
            fill: false,
            spanGaps: true,
            hidden: false
        };
    });

    const ctx = document.getElementById('combinedChart').getContext('2d');
    if (combinedChart) combinedChart.destroy();
    combinedChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: getChartOptions('combined')
    });
}

/**
 * Globally accessible toggle for hiding/showing datasets in the combined chart.
 * @param {string} label - The display name of the game.
 */
window.toggleDataset = function(label) {
    const ds = combinedChart.data.datasets.find(d => d.label === label);
    if (ds) {
        ds.hidden = !ds.hidden;
        combinedChart.update();
    }
};

/**
 * Transform transaction data into chart-ready datasets.
 * @param {string} game - Game key.
 * @param {Array} transactions - Raw transaction array.
 * @returns {object} Chart.js compatible data object.
 */
function processChartData(game, transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) return null;
    const labels = [];
    const profits = [];
    let balance = 0;

    transactions.forEach(transaction => {
        if (Array.isArray(transaction)) {
            const date = new Date(transaction[0]).toLocaleDateString();
            const profit = parseFloat(transaction[1]) || 0;
            labels.push(date);
            profits.push(profit);
        }
    });

    const cumulative = profits.map(p => (balance += p));

    return {
        labels,
        datasets: [
            {
                label: 'Profit/Loss',
                data: profits,
                borderColor: gameColors[game],
                backgroundColor: `${gameColors[game]}30`,
                borderDash: [5, 5],
                tension: 0.2,
                fill: false,
                spanGaps: true
            },
            {
                label: 'Cumulative Balance',
                data: cumulative,
                borderColor: gameColors[game],
                backgroundColor: `${gameColors[game]}10`,
                tension: 0.2,
                fill: true,
                spanGaps: true
            }
        ]
    };
}

/**
 * Returns a Chart.js configuration object.
 * @param {string} game - Game key (used for styling).
 * @returns {object} Chart options.
 */
function getChartOptions(game) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#fff' } },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: $${ctx.raw?.toFixed(2)}`
                }
            }
        },
        scales: {
            x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: {
                ticks: {
                    color: '#fff',
                    callback: (val) => `$${val.toFixed(2)}`
                },
                grid: { color: 'rgba(255,255,255,0.1)' }
            }
        }
    };
}

document.addEventListener("DOMContentLoaded", fetchUserDetails);
</script>
</body>
</html>
