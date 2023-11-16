// Retrieve mergerPlanAmount and ROI from local storage
const mergerPlanAmount = parseFloat(localStorage.getItem('approvedmergerPlan') || 0)
const mergerRoiAmount = parseFloat(localStorage.getItem('mergerroiAmount')) || 0;

// Update Total Deposits, Total Balance, and Active Investments
const displayDeposit = document.getElementById('displayDeposit');
const balancePrimary = document.getElementById('balance-primary');
const activeInvestments = document.getElementById('activeInvestments');
const transactionHistory = document.getElementById('transaction-history')

// Parse the current values from the user dashboard
let totalDeposits = parseFloat(displayDeposit.textContent) || 0;
let totalBalance = parseFloat(balancePrimary.textContent) || 0;
let totalActiveInvestments = parseFloat(activeInvestments.textContent) || 0;

// Add the deposit to Transaction History
const date = new Date().toLocaleString();
addTransactionToHistory('Deposit', mergerPlanAmount, date);

// Accumulate the new values with the current totals
totalDeposits += mergerPlanAmount;
totalBalance += mergerPlanAmount;
totalActiveInvestments += mergerPlanAmount;

// Update the displayed values
displayDeposit.textContent = totalDeposits.toFixed(2);
balancePrimary.textContent = totalBalance.toFixed(2);
activeInvestments.textContent = totalActiveInvestments.toFixed(2);

// Schedule the ROI update every 48 hours
setInterval(function () {
    // Add ROI to Total Balance and Total Investments
    totalBalance += mergerRoiAmount;
    totalActiveInvestments += mergerRoiAmount;
    balancePrimary.textContent = totalBalance.toFixed(2);
    activeInvestments.textContent = totalActiveInvestments.toFixed(2);

    // Add ROI to Transaction History
    addTransactionToHistory('ROI', mergerRoiAmount, new Date().toLocaleString());
}, 48 * 60 * 60 * 1000); // 48 hours in milliseconds

// Helper function to add a transaction to Transaction History
function addTransactionToHistory(type, amount, date) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${type}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${date}</td>
    `;
    transactionHistory.appendChild(newRow);
}




















// const totalDeposits = mergerPlanAmount
// 	const totalBalance = mergerPlanAmount
// 	const totalActiveInvestments = mergerPlanAmount

// 	displayDeposit.textContent = totalDeposits.toFixed(2);
//     balancePrimary.textContent = totalBalance.toFixed(2);
//     activeInvestments.textContent = totalActiveInvestments.toFixed(2);

// 	// Add the deposit to Transaction History
//     const date = new Date().toLocaleString();
//     addTransactionToHistory('Deposit', mergerPlanAmount, date);

//     // Schedule the ROI update every 336 hours
//     setInterval(function () {
//         // Add ROI to Total Balance and Total Investments
//         const newTotalBalance = parseFloat(balancePrimary.textContent) + mergerRoiAmount;
//         balancePrimary.textContent = newTotalBalance.toFixed(2);

//         // Add ROI to Transaction History
//         addTransactionToHistory('ROI', mergerRoiAmount, new Date().toLocaleString());
//     }, 336 * 60 * 60 * 1000); // 336 hours in milliseconds

//     // Helper function to add a transaction to Transaction History
// function addTransactionToHistory(type, amount, date) {
//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//         <td>${type}</td>
//         <td>${amount.toFixed(2)}</td>
//         <td>${date}</td>
//     `;
//     transactionHistory.appendChild(newRow);
// }