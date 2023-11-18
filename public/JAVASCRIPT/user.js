// Read approved plans and their ROI amounts from local storage
const approvedBasicPlan = parseFloat(localStorage.getItem('approvedBasicPlan')) || 0;
const basicRoiAmount = parseFloat(localStorage.getItem('roiAmount')) || 0;

const approvedStandardPlan = parseFloat(localStorage.getItem('approvedStandardPlan')) || 0;
const standardRoiAmount = parseFloat(localStorage.getItem('standardRoiAmount')) || 0;

const approvedEtfPlan = parseFloat(localStorage.getItem('approvedEtfPlan')) || 0;
const etfRoiAmount = parseFloat(localStorage.getItem('etfRoiAmount')) || 0;

const approvedMergerPlan = parseFloat(localStorage.getItem('approvedMergerPlan')) || 0;
const mergerRoiAmount = parseFloat(localStorage.getItem('mergerRoiAmount')) || 0;

const approvedEstatePlan = parseFloat(localStorage.getItem('approvedEstatePlan')) || 0;
const estateRoiAmount = parseFloat(localStorage.getItem('estateRoiAmount')) || 0;

const approvedGoldPlan = parseFloat(localStorage.getItem('approvedGoldPlan')) || 0;
const goldRoiAmount = parseFloat(localStorage.getItem('goldRoiAmount')) || 0;

const approvedImmigrationPlan = parseFloat(localStorage.getItem('approvedImmigrationPlan')) || 0;
const immigrationRoiAmount = parseFloat(localStorage.getItem('immigrationRoiAmount')) || 0;

const approvedInsurancePlan = parseFloat(localStorage.getItem('approvedInsurancePlan')) || 0;
const insuranceRoiAmount = parseFloat(localStorage.getItem('insuranceRoiAmount')) || 0;

const approvedPlatinumPlan = parseFloat(localStorage.getItem('approvedPlatinumPlan')) || 0;
const platinumRoiAmount = parseFloat(localStorage.getItem('platinumRoiAmount')) || 0;

// Update Total Balance, Total Deposits, and Total Investments
const displayDeposit = document.getElementById('displayDeposit');
const balancePrimary = document.getElementById('balance-primary');
const activeInvestments = document.getElementById('activeInvestments');
const transactionHistory = document.getElementById('transaction-history');

const totalDeposits =
  approvedBasicPlan +
  approvedStandardPlan +
  approvedEtfPlan +
  approvedMergerPlan +
  approvedEstatePlan +
  approvedGoldPlan +
  approvedImmigrationPlan +
  approvedInsurancePlan;

const totalBalance =
approvedBasicPlan +
approvedStandardPlan +
approvedEtfPlan +
approvedMergerPlan +
approvedEstatePlan +
approvedGoldPlan +
approvedImmigrationPlan +
approvedInsurancePlan;

const totalInvestments = totalBalance;
// approvedBasicPlan +
// // basicRoiAmount +
// approvedStandardPlan +
// // standardRoiAmount +
// approvedEtfPlan +
// // etfRoiAmount +
// approvedMergerPlan +
// // mergerRoiAmount +
// approvedEstatePlan +
// // estateRoiAmount +
// approvedGoldPlan +
// // goldRoiAmount +
// approvedImmigrationPlan +
// // immigrationRoiAmount +
// approvedInsurancePlan +
// insuranceRoiAmount;

displayDeposit.textContent = totalDeposits.toFixed(2);
balancePrimary.textContent = totalBalance.toFixed(2);
activeInvestments.textContent = totalInvestments.toFixed(2);



// Schedule ROI updates
// Basic Plan (every 48 hours)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + basicRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + basicRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Basic ROI', basicRoiAmount, new Date().toLocaleString());
  }, 48 * 60 * 60 * 1000);


// Standard Plan (every three weeks)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + standardRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + standardRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Standard ROI', standardRoiAmount, new Date().toLocaleString());
  }, 3 * 7 * 24 * 60 * 60 * 1000);


  // Merger Plan (biweekly)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + mergerRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + mergerRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Merger ROI', mergerRoiAmount, new Date().toLocaleString());
  }, 2 * 7 * 24 * 60 * 60 * 1000);


  // Platinum Plan (every 48 hours)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + platinumRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + platinumRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Platinum ROI', platinumRoiAmount, new Date().toLocaleString());
  }, 48 * 60 * 60 * 1000);


  // Gold Plan (every 48 hours)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + goldRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + goldRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Gold ROI', goldRoiAmount, new Date().toLocaleString());
  }, 48 * 60 * 60 * 1000);


  // Real estate Plan (biweekly)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + estateRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + estateRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Real estate ROI', estateRoiAmount, new Date().toLocaleString());
  }, 2 * 7 * 24 * 60 * 60 * 1000);


  // ETF Plan (biweekly)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + etfRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + etfRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('ETF ROI', etfRoiAmount, new Date().toLocaleString());
  }, 2 * 7 * 24 * 60 * 60 * 1000);


  // ETF Plan (every two weeks)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + etfRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + etfRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('ETF ROI', etfRoiAmount, new Date().toLocaleString());
  }, 2 * 7 * 24 * 60 * 60 * 1000);


   // Insurance Plan (every week)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + insuranceRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + insuranceRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Insurance ROI', insuranceRoiAmount, new Date().toLocaleString());
  }, 1 * 7 * 24 * 60 * 60 * 1000);


  // Immigration Plan (biweekly)
setInterval(function () {
    const newTotalBalance = parseFloat(balancePrimary.textContent) + immigrationRoiAmount;
    const newTotalInvestments = parseFloat(activeInvestments.textContent) + immigrationRoiAmount;
    balancePrimary.textContent = newTotalBalance.toFixed(2);
    activeInvestments.textContent = newTotalInvestments.toFixed(2);
  
    // Add ROI to Transaction History
    addTransactionToHistory('Immigration ROI', immigrationRoiAmount, new Date().toLocaleString());
  }, 2 * 7 * 24 * 60 * 60 * 1000);











// Add the deposit to Transaction History
const date = new Date().toLocaleString();
addTransactionToHistory('Deposit', totalDeposits, date);

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

// Example usage for the approvedStandardPlan
addTransactionToHistory('Standard Plan', approvedStandardPlan, new Date().toLocaleString());
addTransactionToHistory('Basic Plan', approvedBasicPlan, new Date().toLocaleString());
addTransactionToHistory('Immigration Plan', approvedImmigrationPlan, new Date().toLocaleString());
addTransactionToHistory('Insurance Plan', approvedInsurancePlan, new Date().toLocaleString());
// addTransactionToHistory('ETF Plan', approvedBasicPlan, new Date().toLocaleString());
addTransactionToHistory('Gold Plan', approvedGoldPlan, new Date().toLocaleString());
addTransactionToHistory('Real estate Plan', approvedEstatePlan, new Date().toLocaleString());
addTransactionToHistory('Merger Plan', approvedMergerPlan, new Date().toLocaleString());
addTransactionToHistory('Platinum Plan', approvedPlatinumPlan, new Date().toLocaleString());