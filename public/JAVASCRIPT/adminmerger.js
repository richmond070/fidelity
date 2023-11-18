//transactions
// const transactionAlertsContainer = document.getElementById('transaction-alerts-container');
// const approveButton = document.getElementById('approveButton');
// const declineButton = document.getElementById('declineButton');
// const transactionHistoryTable = document.querySelector('.transaction-history table');
// const alertsQueue = []; // Array to store alerts

// // Retrieve investment info from local storage
// const mergerinvestmentInfo = localStorage.getItem('mergerInvestmentInfo');
// if (mergerinvestmentInfo) {
//     const alertMessage = document.createElement('p');
//     alertMessage.textContent = mergerinvestmentInfo;
//     transactionAlertsContainer.appendChild(alertMessage);
// }

approveButton.addEventListener('click', () => {
    // Retrieve the amount and date from merger investment info
    const [mergeramount] = mergerinvestmentInfo.match(/\d+/);
    const date = new Date().toLocaleString();

    // Calculate ROI (10% every 48 hours)
    const mergerRoiAmount = (mergeramount * 0.90).toFixed(2);
    
    // Log the approved transaction in transaction history
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>Merger plan</td>
        <td>${mergeramount}</td>
        <td>${date}</td>
        <td>Approved</td>
    `;
    transactionHistoryTable.appendChild(transactionRow);

    // Save the approved amount and ROI in local storage
    localStorage.setItem('approvedmergerPlan', mergeramount);
    localStorage.setItem('mergerRoiAmount', mergerRoiAmount);

    // Clear the transaction alerts 
    transactionAlertsContainer.innerHTML = '';
});

declineButton.addEventListener('click', () => {
    // Log the declined transaction in transaction history
    const [mergeramount] = mergerinvestmentInfo.match(/\d+/);
    const date = new Date().toLocaleString();
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>Merger plan</td>
        <td>${mergeramount}</td>
        <td>${date}</td>
        <td>Declined</td>
    `;
    transactionHistoryTable.appendChild(transactionRow);

    // Clear the transaction alerts
    transactionAlertsContainer.innerHTML = '';
});
