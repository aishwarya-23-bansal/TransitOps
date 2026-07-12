const { Parser } = require('json2csv');

function dateValue(value) { return value ? new Date(value).toISOString().slice(0, 10) : ''; }
function section(title, rows) {
  if (!rows.length) return `${title}\nNo data\n`;
  return `${title}\n${new Parser().parse(rows)}\n`;
}

function generateCsv(report) {
  const fuelLogs = report.fuelLogs.map((item) => ({ vehicleId: item.vehicleId, liters: item.liters, cost: item.cost, date: dateValue(item.date) }));
  const expenseLogs = report.expenseLogs.map((item) => ({ vehicleId: item.vehicleId, type: item.type, amount: item.amount, description: item.description, date: dateValue(item.date) }));
  const dashboard = [{ ...report.dashboard, topVehicle: report.dashboard.topVehicle.vehicleId || '' }];
  return [section('FUEL LOGS', fuelLogs), section('EXPENSE LOGS', expenseLogs), section('OPERATIONAL COST', report.operationalCosts),
    section('FUEL EFFICIENCY', report.fuelEfficiency), section('FLEET UTILIZATION', [report.fleetUtilization]),
    section('VEHICLE ROI', report.vehicleRoi), section('DASHBOARD', dashboard)].join('\n');
}

module.exports = { generateCsv };
