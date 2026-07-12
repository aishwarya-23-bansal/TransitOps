const Fuel = require('../models/Fuel');
const Expense = require('../models/Expense');
const analytics = require('./analyticsService');

async function getReportData() {
  const [fuelLogs, expenseLogs, operationalCosts, fuelEfficiency, fleetUtilization, vehicleRoi, dashboard] = await Promise.all([
    Fuel.find().sort({ date: -1 }).lean(), Expense.find().sort({ date: -1 }).lean(), analytics.operationalCosts(),
    analytics.fuelEfficiency(), analytics.fleetUtilization(), analytics.vehicleRoi(), analytics.dashboard(),
  ]);
  return { fuelLogs, expenseLogs, operationalCosts, fuelEfficiency, fleetUtilization, vehicleRoi, dashboard };
}

module.exports = { getReportData };
