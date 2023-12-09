// This na to Retrieve InvestmentInfo, MergerInvestmentInfo, PlatinumInvestmentInfo, EstateInvestmentInfo, InsuranceInvestmentInfo, ETFInvestmentInfo, and GoldInvestmentInfo from local storage
const investmentInfo = localStorage.getItem('investmentInfo');
const mergerInvestmentInfo = localStorage.getItem('mergerInvestmentInfo');
const platinumInvestmentInfo = localStorage.getItem('platinumInvestmentInfo');
const estateInvestmentInfo = localStorage.getItem('estateInvestmentInfo');
const insuranceInvestmentInfo = localStorage.getItem('insuranceInvestmentInfo');
const etfInvestmentInfo = localStorage.getItem('etfInvestmentInfo');
const goldInvestmentInfo = localStorage.getItem('goldInvestmentInfo');
const immigrationInvestmentInfo = localStorage.getItem('immigrationInvestmentInfo');
const standardInvestmentInfo = localStorage.getItem('standardInvestmentInfo');

// This na to Function to add a transaction alert to the transaction alerts container
function addTransactionAlert(message) {
  const alertMessage = document.createElement('p');
  alertMessage.textContent = message;
  transactionAlertsContainer.appendChild(alertMessage);
}

// This na to Check for each type of investment info and add to transaction alerts
if (investmentInfo) {
    addTransactionAlert(investmentInfo);
  }
  if (mergerInvestmentInfo) {
    addTransactionAlert(mergerInvestmentInfo);
  }
  if (platinumInvestmentInfo) {
    addTransactionAlert(platinumInvestmentInfo);
  }
  if (estateInvestmentInfo) {
    addTransactionAlert(estateInvestmentInfo);
  }
  if (insuranceInvestmentInfo) {
    addTransactionAlert(insuranceInvestmentInfo);
  }
  if (etfInvestmentInfo) {
    addTransactionAlert(etfInvestmentInfo);
  }
  if (goldInvestmentInfo) {
    addTransactionAlert(goldInvestmentInfo);
  }
  if (immigrationInvestmentInfo){
    addTransactionAlert(immigrationInvestmentInfo);
  }
  if (standardInvestmentInfo) {
    addTransactionAlert(standardInvestmentInfo);
  }
  
  approveButton.addEventListener('click', () => {
    // Handle each type of investment info separately
    if (investmentInfo) {
    // Calculate ROI (10% of the amount)
    const [amount] = investmentInfo.match(/\d+/);
    const roiAmount = (amount * 0.10).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Basic plan', amount, date, 'Approved');

    //This na to Store approved amount and ROI in local storage
    localStorage.setItem('approvedBasicPlan', amount);
    localStorage.setItem('roiAmount', roiAmount);
  // Handle decline actions similarly to approve
  declineButton.addEventListener('click', () =>{
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
  });
  }
    if (mergerInvestmentInfo) {
    // Calculate ROI 
    const [mergerAmount] = mergerInvestmentInfo.match(/\d+/);
    const mergerRoiAmount = (mergerAmount * 0.90).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Merger plan', mergerAmount, date, 'Approved');

    //This na to Store approved amount and ROI in local storage
    localStorage.setItem('approvedMergerPlan', mergerAmount);
    localStorage.setItem('mergerRoiAmount', mergerRoiAmount);
  }
    if (platinumInvestmentInfo) {
      // Calculate ROI 
    const [platinumAmount] = platinumInvestmentInfo.match(/\d+/);
    const platinumRoiAmount = (platinumAmount * 0.50).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Platinum plan', platinumAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedPlatinumPlan', platinumAmount);
    localStorage.setItem('platinumRoiAmount', platinumRoiAmount);
  }
    if (estateInvestmentInfo) {
      // Calculate ROI 
    const [estateAmount] = estateInvestmentInfo.match(/\d+/);
    const estateRoiAmount = (estateAmount * 0.75).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Estate plan', estateAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedEstatePlan', estateAmount);
    localStorage.setItem('estateRoiAmount', estateRoiAmount);
  }
    if (insuranceInvestmentInfo) {
      // Calculate ROI 
    const [insuranceAmount] = insuranceInvestmentInfo.match(/\d+/);
    const insuranceRoiAmount = (insuranceAmount * 0.20).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Insurance plan', insuranceAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedInsurancePlan', insuranceAmount);
    localStorage.setItem('insuranceRoiAmount', insuranceRoiAmount);
  }
    if (etfInvestmentInfo) {
      // Calculate ROI 
    const [etfAmount] = etfInvestmentInfo.match(/\d+/);
    const etfRoiAmount = (etfAmount * 0.55).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('ETF plan', etfAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedEtfPlan', etfAmount);
    localStorage.setItem('etfRoiAmount', etfRoiAmount);
  }
    if (goldInvestmentInfo) {
      // Calculate ROI 
    const [goldAmount] = goldInvestmentInfo.match(/\d+/);
    const goldRoiAmount = (goldAmount * 0.38).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Gold plan', goldAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedGoldPlan', goldAmount);
    localStorage.setItem('goldRoiAmount', goldRoiAmount);
  }
    if (immigrationInvestmentInfo) {
        // Calculate ROI 
    const [immigrationAmount] = immigrationInvestmentInfo.match(/\d+/);
    const immigrationRoiAmount = (immigrationAmount * 0.75).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Immigration', immigrationAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedImmigrationPlan', immigrationAmount);
    localStorage.setItem('immigrationRoiAmount', immigrationRoiAmount);
    } 
    if (standardInvestmentInfo) {
      // Calculate ROI 
    const [standardAmount] = standardInvestmentInfo.match(/\d+/);
    const standardRoiAmount = (standardAmount * 0.15).toFixed(2);

    const date = new Date().toLocaleString();
    addTransactionToHistory('Standard plan', standardAmount, date, 'Approved');

    // Store approved amount and ROI in local storage
    localStorage.setItem('approvedStandardPlan', standardAmount);
    localStorage.setItem('standardRoiAmount', standardRoiAmount);
  }
    // Clear the transaction alerts
    transactionAlertsContainer.innerHTML = '';
  });
  
  // Handle decline actions similarly to approve
  declineButton.addEventListener('click', () =>{

  });
  
  // Helper function to add a transaction to the transaction history
  function addTransactionToHistory(type, amount, date, status) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${type}</td>
      <td>${amount}</td>
      <td>${date}</td>
      <td>${status}</td>
    `;
    transactionHistoryTable.appendChild(newRow);
  }
  
