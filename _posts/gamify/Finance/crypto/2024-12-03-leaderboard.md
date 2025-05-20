---
layout: fortunefinders
permalink: /leaderboard/overall-leaderboard
title: Leaderboard
---

<title>Leaderboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<style>
  /* General Styles */
  body {
      font-family: 'Poppins', sans-serif;
      background-color: #121212;
      color: #ffffff;
      margin: 0;
      padding: 0;
  }
  /* Navigation Bar */
  .navbar {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px 0;
      background-color: #1c1c1c;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  .nav-buttons {
      display: flex;
      gap: 15px;
  }
  .nav-buttons a {
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      padding: 10px 20px;
      border-radius: 6px;
      transition: 0.3s;
  }
  .nav-buttons a:hover {
      background-color: #ff9800;
      transform: scale(1.1);
  }
  /* Leaderboard Container */
  .dashboard {
      padding: 40px;
      text-align: center;
  }
  /* Title Styling */
  .leaderboard-title {
      font-size: 32px;
      font-weight: bold;
      text-transform: uppercase;
      background: linear-gradient(90deg, #ff8c00, #ff22a6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
      padding-bottom: 10px;
      border-bottom: 3px solid #ff22a6;
      letter-spacing: 2px;
      margin-bottom: 20px;
  }
  /* Search Box Styling */
  .search-container {
      max-width: 800px;
      margin: 0 auto 25px;
      position: relative;
  }
  #leaderboard-search {
      width: 100%;
      padding: 12px 20px;
      border-radius: 6px;
      border: 2px solid #ff9800;
      background-color: #2a2a2a;
      color: white;
      font-size: 16px;
      transition: all 0.3s;
  }
  #leaderboard-search:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
      border-color: #ffcc00;
  }
  /* Leaderboard Table */
  .leaderboard-table {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      border-collapse: collapse;
      background: #1f1f1f;
      border-radius: 8px;
      box-shadow: 0px 0px 15px rgba(255, 136, 0, 0.5);
      overflow: hidden;
  }
  th, td {
      padding: 15px 20px;
      text-align: left;
  }
  th {
      background-color: #ff9800;
      color: #000;
      font-size: 18px;
      text-transform: uppercase;
  }
  td {
      background-color: #2a2a2a;
      font-size: 16px;
      border-bottom: 1px solid #444;
      transition: background 0.3s;
  }
  tr:hover td {
      background-color: #ff22a6;
      color: #ffffff;
  }
  /* Cell Specific Styling */
  .rank {
      font-weight: bold;
      color: #ffcc00;
  }
  .balance {
      color: #00ff7f;
      font-weight: bold;
  }
  .name {
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
      text-decoration: underline;
      transition: color 0.2s;
  }
  .name:hover {
      color: #ff9800;
  }
  /* Loading and Error States */
  .loading-message, .error-message {
      text-align: center;
      padding: 20px;
      font-style: italic;
  }
  .loading-message {
      color: #ff9800;
  }
  .error-message {
      color: #ff4444;
  }
  .no-results {
      text-align: center;
      color: #ff9800;
      padding: 20px;
      font-style: italic;
  }
  /* Loading Animation */
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  .loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top: 4px solid #ff9800;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
  }
</style>

<!-- Dashboard -->
<div class="dashboard">
  <h1 class="leaderboard-title">Banking Leaderboard</h1>
  
  <!-- Search Box -->
  <div class="search-container">
    <input type="text" id="leaderboard-search" placeholder="Search by username..." aria-label="Search users">
    <div id="search-status"></div>
  </div>
  
  <!-- Leaderboard Table -->
  <table class="leaderboard-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Balance</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody id="top-users-table">
      <tr>
        <td colspan="3" class="loading-message">
          <div class="loading-spinner"></div>
          Loading leaderboard data...
        </td>
      </tr>
    </tbody>
  </table>
</div>

<script type="module">
import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

// Debounce function to limit API calls during typing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
// Display loading state
function showLoading() {
    $('#top-users-table').html(`
        <tr>
            <td colspan="3" class="loading-message">
                <div class="loading-spinner"></div>
                Loading data...
            </td>
        </tr>
    `);
}
// Redirect to bank analytics page
function redirectToAnalytics(userId) {
    window.location.href = `/portfolio_2025/gamify/bankanalytics?userId=${userId}`;
}
// Main function to fetch and display leaderboard data
async function fetchLeaderboard(searchQuery = '') {
    showLoading();
    
    try {
        let url = `${javaURI}/bank/leaderboard`;
        if (searchQuery) {
            url = `${javaURI}/bank/leaderboard/search?query=${encodeURIComponent(searchQuery)}`;
            $('#search-status').html(`<small>Searching for: "${searchQuery}"</small>`).css('color', '#ff9800');
        } else {
            $('#search-status').empty();
        }

        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
            throw new Error("Invalid data format received from server");
        }
        
        const $topUsersTable = $('#top-users-table');
        $topUsersTable.empty();
        
        if (result.data.length === 0) {
            $topUsersTable.append(`
                <tr>
                    <td colspan="3" class="no-results">
                        No users found matching "${searchQuery}"
                    </td>
                </tr>
            `);
            return;
        }
        
        result.data.forEach(entry => {
            const displayName = entry.username && entry.username !== "undefined" 
                ? entry.username 
                : `User ${entry.userId}`;
                
            const row = `
                <tr>
                    <td class="rank">${entry.rank}</td>
                    <td class="balance">$${Number(entry.balance).toFixed(2)}</td>
                    <td class="name" onclick="redirectToAnalytics(${entry.userId})" 
                        title="View ${displayName}'s analytics">
                        ${displayName}
                    </td>
                </tr>
            `;
            $topUsersTable.append(row);
        });
        
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        $('#top-users-table').html(`
            <tr>
                <td colspan="3" class="error-message">
                    Error loading data: ${error.message}
                </td>
            </tr>
        `);
    }
}

// Initialize when DOM is ready
$(document).ready(function() {
    // Initial load
    fetchLeaderboard();
    
    // Search functionality with debounce (350ms delay)
    $('#leaderboard-search').on('input', debounce(function() {
        const searchQuery = $(this).val().trim();
        fetchLeaderboard(searchQuery);
    }, 350));
    
    // Clear search when clicking 'x' in search field (IE/Edge support)
    $('#leaderboard-search').on('search', function() {
        if ($(this).val() === '') {
            fetchLeaderboard();
        }
    });
    
    // Make redirect function available globally
    window.redirectToAnalytics = redirectToAnalytics;
});
</script>