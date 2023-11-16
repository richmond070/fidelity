// WITHDRAWAL
    
const withdrawalAlertContainer = document.getElementById('withdrawal-alert-container');

const confirmWithdrawalButton = document.getElementById('confirmWithdrawalButton');



// Display withdrawal information from local storage
const withdrawalInfo = localStorage.getItem('Withdrawal');
if (withdrawalInfo) {
    const alertMessage = document.createElement('p');
    alertMessage.textContent = withdrawalInfo;
    withdrawalAlertContainer.appendChild(alertMessage);
    // Show the "Confirm Withdrawal" button
    confirmWithdrawalButton.style.display = 'block';
}

confirmWithdrawalButton.addEventListener('click', () => {
    // Retrieve the amount and date from investment info
    const [amount] = withdrawalInfo.match(/\d+/);
    const date = new Date().toLocaleString();


// Log the approved transaction in transaction history
const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>Withdrawal</td>
        <td>${amount}</td>
        <td>${date}</td>
        <td>confirmed</td>
    `;
    transactionHistoryTable.appendChild(transactionRow);

    // // Save the approved amount and ROI in local storage
    // localStorage.setItem('approvedWithdrawal', amount);

    // Clear the transaction alerts 
    withdrawalAlertContainer.innerHTML = '';
    // Hide the "Confirm Withdrawal" button
    confirmWithdrawalButton.style.display = 'none';
});
    

// Helper function to log transactions in the history
function logTransaction(type) {
    if (type.includes('Withdrawal')) {
        const [, amount, date, status] = withdrawalInfo.split('. ');
        const transactionType = type;
        const transactionDate = date.split(': ')[1];

        // Create a new row for the transaction history
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${transactionType}</td>
            <td>${amount.split(' ')[1]}</td>
            <td>${transactionDate}</td>
            <td>${status}</td>
        `;
        transactionHistoryTable.querySelector('tbody').appendChild(newRow);

        // Clear the transaction alerts for withdrawals
        withdrawalAlertContainer.innerHTML = '';
        // Hide the "Confirm Withdrawal" button
        confirmWithdrawalButton.style.display = 'none';
    } else {
        // Handle investment approval/decline here
    }
}