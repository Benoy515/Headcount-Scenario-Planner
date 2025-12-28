// Utility functions for burn rate and runway calculations

/**
 * Calculate monthly burn rate for a specific month
 * @param {Array} hires - Array of hire objects
 * @param {number} monthIndex - The month index (0-23)
 * @returns {number} - Monthly burn rate
 */
export function calculateMonthlyBurn(hires, monthIndex) {
  return hires
    .filter(hire => hire.startMonth <= monthIndex)
    .reduce((sum, hire) => sum + (hire.salary / 12), 0);
}

/**
 * Calculate cumulative burn up to a specific month
 * @param {Array} hires - Array of hire objects
 * @param {number} monthIndex - The month index (0-23)
 * @returns {number} - Cumulative burn
 */
export function calculateCumulativeBurn(hires, monthIndex) {
  let total = 0;
  for (let i = 0; i <= monthIndex; i++) {
    total += calculateMonthlyBurn(hires, i);
  }
  return total;
}

/**
 * Calculate runway in months
 * @param {number} startingCash - Starting cash amount
 * @param {Array} hires - Array of hire objects
 * @param {number} maxMonths - Maximum months to calculate (default 24)
 * @returns {Object} - { runwayMonths, runoutMonth, monthlyBurns }
 */
export function calculateRunway(startingCash, hires, maxMonths = 24) {
  let remainingCash = startingCash;
  let runwayMonths = 0;
  let runoutMonth = -1;
  const monthlyBurns = [];

  for (let month = 0; month < maxMonths; month++) {
    const burn = calculateMonthlyBurn(hires, month);
    monthlyBurns.push(burn);

    if (burn > 0) {
      remainingCash -= burn;
      if (remainingCash <= 0) {
        runoutMonth = month;
        break;
      }
      runwayMonths++;
    } else {
      runwayMonths++;
    }
  }

  // If we haven't run out in maxMonths, runway is maxMonths+
  if (runoutMonth === -1 && monthlyBurns[maxMonths - 1] > 0) {
    runwayMonths = maxMonths;
  }

  return {
    runwayMonths,
    runoutMonth,
    monthlyBurns
  };
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get runway status color
 * @param {number} runwayMonths - Number of runway months
 * @returns {string} - Status color ('green', 'yellow', 'red')
 */
export function getRunwayStatus(runwayMonths) {
  if (runwayMonths >= 12) return 'green';
  if (runwayMonths >= 6) return 'yellow';
  return 'red';
}
