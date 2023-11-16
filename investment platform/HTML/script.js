// Deposit section
const depositForm = document.getElementById('deposit-form');
const depositAmount = document.getElementById('deposit-secondary');
const depositButton = document.getElementById('deposit-button');

depositButton.addEventListener('click', () => {
  const amount = depositAmount.value;
  
  // Open transaction ID input
  const transactionIDInput = document.createElement('input');
  transactionIDInput.type = 'text';
  transactionIDInput.placeholder = 'Transaction ID';
  
  const submitIDButton = document.createElement('button');
  submitIDButton.textContent = 'Submit';
  
  const transactionIDForm = document.createElement('div');
  transactionIDForm.appendChild(transactionIDInput);
  transactionIDForm.appendChild(submitIDButton);
  
  depositForm.appendChild(transactionIDForm);
  
  submitIDButton.addEventListener('click', () => {
    const transactionID = transactionIDInput.value;
    if (!transactionID) {
      alert('Please enter a transaction ID');
      return;
    }
    
    // Send admin approval alert
    sendAdminAlert('Approve deposit ' + amount + ' and ' + transactionID, amount, transactionID);
  });
});

function sendAdminAlert(message, amount, transactionID) {
  // Create alert on admin page
  const alert = document.createElement('div');
  alert.textContent = message;
  
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Accept';
  acceptButton.classList.add('accept-button');
  
  const declineButton = document.createElement('button');
  declineButton.textContent = 'Decline';
  declineButton.classList.add('decline-button');
  
  alert.appendChild(acceptButton);
  alert.appendChild(declineButton);
  
  document.getElementById('transaction-alerts').appendChild(alert);
  
  // Handle accept/decline
  acceptButton.addEventListener('click', () => {
    approveDeposit(amount, transactionID);
    alert.remove();
  });
  
  declineButton.addEventListener('click', () => {
    declineDeposit(amount, transactionID);
    alert.remove();
  });
}

function approveDeposit(amount, transactionID) {
  // Update totals
  updateTotalDeposit(amount);
  updateTotalBalance(amount);
  
  // Add to transaction history
  addTransaction('deposit', amount, 'approved', transactionID);
}

function declineDeposit(amount, transactionID) {
  // Add to transaction history
  addTransaction('deposit', amount, 'declined', transactionID); 
}

// Similar logic for withdrawals

// Plans invest now button
const investButtons = document.querySelectorAll('.btn');

investButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Prompt for investment amount
    const amount = prompt('Enter investment amount');
    
    if (button.parentElement.parentElement.querySelector('h3').textContent === 'Basic plan') {
      // Validate amount
      if (amount < 100 || amount > 1000) {
        alert('Please enter an amount between $100 and $1000');
        return;
      }
    } else if (button.parentElement.parentElement.querySelector('h3').textContent === 'Standard plan') {
      // Validate amount
      if (amount < 25000) { 
        alert('Please enter an amount of at least $25,000');
        return; 
      }
    }
    
    // Check balance
    const balance = getTotalBalance();
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }
    
    // Complete transaction
    alert('Investment successful!');
    addReferralBonus(amount);
    addTransaction(button.parentElement.parentElement.querySelector('h3').textContent.toLowerCase(), amount, 'completed');
  });
});

// Helper functions
function getTotalBalance() {
  // Get total balance
}

function updateTotalDeposit(amount) {
  // Update deposit total 
}

function updateTotalBalance(amount) {
  // Update balance
}

function addReferralBonus(amount) {
  // Add referral bonus
}

function addTransaction(type, amount, status, transactionID) {
  // Add to transaction history
}