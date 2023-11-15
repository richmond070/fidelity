// Retrieve BasicPlanAmount and ROI from local storage
const basicPlanAmount = parseFloat(localStorage.getItem('approvedBasicPlan')) || 0;
const roiAmount = parseFloat(localStorage.getItem('roiAmount')) || 0;

// Update Total Deposits, Total Balance, and Active Investments
const displayDeposit = document.getElementById('displayDeposit');
const balancePrimary = document.getElementById('balance-primary');
const activeInvestments = document.getElementById('activeInvestments');
const transactionHistory = document.getElementById('transaction-history');

// Parse the current values from the user dashboard
let totalDeposits = parseFloat(displayDeposit.textContent) || 0;
let totalBalance = parseFloat(balancePrimary.textContent) || 0;
let totalActiveInvestments = parseFloat(activeInvestments.textContent) || 0;

// Add the deposit to Transaction History
const date = new Date().toLocaleString();
addTransactionToHistory('Deposit', basicPlanAmount, date);

// Accumulate the new values with the current totals
totalDeposits += basicPlanAmount;
totalBalance += basicPlanAmount;
totalActiveInvestments += basicPlanAmount;

// Update the displayed values
displayDeposit.textContent = totalDeposits.toFixed(2);
balancePrimary.textContent = totalBalance.toFixed(2);
activeInvestments.textContent = totalActiveInvestments.toFixed(2);

// Schedule the ROI update every 48 hours
setInterval(function () {
    // Add ROI to Total Balance and Total Investments
    totalBalance += roiAmount;
    totalActiveInvestments += roiAmount;
    balancePrimary.textContent = totalBalance.toFixed(2);
    activeInvestments.textContent = totalActiveInvestments.toFixed(2);

    // Add ROI to Transaction History
    addTransactionToHistory('ROI', roiAmount, new Date().toLocaleString());
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












// // Retrieve BasicPlanAmount and ROI from local storage
// const basicPlanAmount = parseFloat(localStorage.getItem('approvedBasicPlan')) || 0;
// const roiAmount = parseFloat(localStorage.getItem('roiAmount')) || 0;
// // // Retrieve mergerPlanAmount and ROI from local storage
// // const mergerPlanAmount = parseFloat(localStorage.getItem('approvedmergerPlan'))
// // const mergerRoiAmount = parseFloat(localStorage.getItem('mergerroiAmount')) || 0;


// // Update Total Deposits, Total Balance, and Active Investments
// const displayDeposit = document.getElementById('displayDeposit');
// const balancePrimary = document.getElementById('balance-primary');
// const activeInvestments = document.getElementById('activeInvestments');
// const transactionHistory = document.getElementById('transaction-history');

// const totalDeposits = basicPlanAmount;
// const totalBalance = basicPlanAmount;
// const totalActiveInvestments = basicPlanAmount;

// displayDeposit.textContent = totalDeposits.toFixed(2);
// balancePrimary.textContent = totalBalance.toFixed(2);
// activeInvestments.textContent = totalActiveInvestments.toFixed(2);

// // Add the deposit to Transaction History
// const date = new Date().toLocaleString();
// addTransactionToHistory('Deposit', basicPlanAmount, date)

// // Schedule the ROI update every 48 hours
// setInterval(function () {
//     // Add ROI to Total Balance and Total Investments
//     const newTotalBalance = parseFloat(balancePrimary.textContent) + roiAmount;
//     const newTotalActiveInvestments = parseFloat(activeInvestments.textContent) + roiAmount;
//     balancePrimary.textContent = newTotalBalance.toFixed(2);
//     activeInvestments.textContent = newTotalActiveInvestments.toFixed(2);

//     // Add ROI to Transaction History
//     addTransactionToHistory('ROI', roiAmount, new Date().toLocaleString());
// }, 48 * 60 * 60 * 1000); // 48 hours in milliseconds



// // // Save the updated values back to local storage
// // localStorage.setItem('TotalDeposits', totalDeposits);
// // localStorage.setItem('TotalBalance', totalBalance);
// // localStorage.setItem('TotalActiveInvestments', totalActiveInvestments);




// // Helper function to add a transaction to Transaction History
// function addTransactionToHistory(type, amount, date) {
//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//         <td>${type}</td>
//         <td>${amount.toFixed(2)}</td>
//         <td>${date}</td>
//     `;
//     transactionHistory.appendChild(newRow);
// }







// // Retrieve the current values for Total Deposits, Total Balance, and Total Active Investments from local storage
// let totalDeposits = parseFloat(localStorage.getItem('TotalDeposits')) || 0;
// let totalBalance = parseFloat(localStorage.getItem('TotalBalance')) || 0;
// let totalActiveInvestments = parseFloat(localStorage.getItem('TotalActiveInvestments')) || 0;

// // Accumulate the new values
// totalDeposits += basicPlanAmount;
// totalBalance += basicPlanAmount;
// totalActiveInvestments += basicPlanAmount;

// // Update the displayed values
// const displayDeposit = document.getElementById('displayDeposit');
// const balancePrimary = document.getElementById('balance-primary');
// const activeInvestments = document.getElementById('activeInvestments');

// displayDeposit.textContent = totalDeposits.toFixed(2);
// balancePrimary.textContent = totalBalance.toFixed(2);
// activeInvestments.textContent = totalActiveInvestments.toFixed(2);