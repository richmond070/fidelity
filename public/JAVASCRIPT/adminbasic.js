// //transactions
// const transactionAlertsContainer = document.getElementById('transaction-alerts-container');
// const approveButton = document.getElementById('approveButton');
// const declineButton = document.getElementById('declineButton');
// const transactionHistoryTable = document.querySelector('.transaction-history table');
// const alertsQueue = []; // Array to store alerts

// // Retrieve investment info from local storage
// const investmentInfo = localStorage.getItem('investmentInfo');
// if (investmentInfo) {
//     const alertMessage = document.createElement('p');
//     alertMessage.textContent = investmentInfo;
//     transactionAlertsContainer.appendChild(alertMessage);
// }

approveButton.addEventListener('click', () => {
    // Retrieve the amount and date from investment info
    const [amount] = investmentInfo.match(/\d+/);
    const date = new Date().toLocaleString();

    // Calculate ROI (10% every 48 hours)
    const roiAmount = (amount * 0.10).toFixed(2);
    
    // Log the approved transaction in transaction history
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>Basic plan</td>
        <td>${amount}</td>
        <td>${date}</td>
        <td>Approved</td>
    `;
    transactionHistoryTable.appendChild(transactionRow);

    // Save the approved amount and ROI in local storage
    localStorage.setItem('approvedBasicPlan', amount);
    localStorage.setItem('roiAmount', roiAmount);

    // Clear the transaction alerts 
    transactionAlertsContainer.innerHTML = '';
    approveButton.style.display = 'none'
    declineButton.style.display = 'none'
});

declineButton.addEventListener('click', () => {
    // Log the declined transaction in transaction history
    const [amount] = investmentInfo.match(/\d+/);
    const date = new Date().toLocaleString();
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>Basic plan</td>
        <td>${amount}</td>
        <td>${date}</td>
        <td>Declined</td>
    `;
    transactionHistoryTable.appendChild(transactionRow);

    // Clear the transaction alerts
    transactionAlertsContainer.innerHTML = '';
    declineButton.style.display = 'none'
    approveButton.style.display = 'none'
});


