// Initialization code
// Retrieve the initial total withdrawals from local storage
const totalWithdrawals = parseFloat(localStorage.getItem('totalWithdrawals')) || 0;
document.getElementById('withdraw-primary').textContent = totalWithdrawals.toFixed(2);

// Withdrawal handling function
function handleWithdrawalSubmission() {
    const walletAddress = document.getElementById('wallet-address').value;
    const withdrawalAmount = parseFloat(document.getElementById('withdrawal-amount').value);

    // Check if wallet address and withdrawal amount are filled
    if (!walletAddress || isNaN(withdrawalAmount)) {
        alert('Please fill in the wallet address and withdrawal amount appropriately.');
        return;
    }

    const currentBalance = parseFloat(balancePrimary.textContent);
    const currentInvestments = parseFloat(activeInvestments.textContent);

    // Check if the balance is sufficient for withdrawal
    if (withdrawalAmount > currentBalance) {
        alert('Insufficient balance for withdrawal.');
        return;
    }

    // Deduct the withdrawal amount from Total Balance and Total Investments
    balancePrimary.textContent = (currentBalance - withdrawalAmount).toFixed(2);
    activeInvestments.textContent = (currentInvestments - withdrawalAmount).toFixed(2);

    // Update Total Withdrawals
    const newTotalWithdrawals = totalWithdrawals + withdrawalAmount;
    document.getElementById('withdraw-primary').textContent = newTotalWithdrawals.toFixed(2);

    // Save the updated total withdrawals in local storage
    localStorage.setItem('totalWithdrawals', newTotalWithdrawals);

    // Save withdrawal information in local storage
    localStorage.setItem('Withdrawal', `Amount: ${withdrawalAmount}. Wallet Address: ${walletAddress}`);
    // Redirect to the next page (success.html)
    location.href = 'successwithdraw.html'; 


    // Add a new transaction to the Transaction History
    const transactionHistory = document.getElementById('transaction-history');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>Withdrawal</td>
        <td>${withdrawalAmount.toFixed(2)}</td>
        <td>${new Date().toLocaleString()}</td>
    `;
    transactionHistory.appendChild(newRow);

    // Clear the form
    document.getElementById('wallet-address').value = '';
    document.getElementById('withdrawal-amount').value = '';
}
