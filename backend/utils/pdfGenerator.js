const PDFDocument = require('pdfkit');

function renderRows(document, title, rows) {
  document.fontSize(15).fillColor('#12355b').text(title).moveDown(0.3);
  if (!rows.length) { document.fontSize(10).fillColor('black').text('No data available.').moveDown(); return; }
  rows.forEach((row) => {
    document.fontSize(9).fillColor('black').text(Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(' | '));
  });
  document.moveDown();
}

function writePdf(res, report) {
  const document = new PDFDocument({ margin: 45, size: 'A4' });
  document.pipe(res);
  document.fontSize(22).fillColor('#12355b').text('TransitOps Analytics Report');
  document.fontSize(9).fillColor('gray').text(`Generated: ${new Date().toISOString()}`).moveDown();
  renderRows(document, 'Dashboard', [{ ...report.dashboard, topVehicle: report.dashboard.topVehicle.vehicleId || 'N/A' }]);
  renderRows(document, 'Operational Cost', report.operationalCosts);
  renderRows(document, 'Fuel Efficiency', report.fuelEfficiency);
  renderRows(document, 'Fleet Utilization', [report.fleetUtilization]);
  renderRows(document, 'Vehicle ROI', report.vehicleRoi);
  renderRows(document, 'Fuel Logs', report.fuelLogs.map((item) => ({ vehicleId: String(item.vehicleId), liters: item.liters, cost: item.cost, date: item.date.toISOString().slice(0, 10) })));
  renderRows(document, 'Expense Logs', report.expenseLogs.map((item) => ({ vehicleId: String(item.vehicleId), type: item.type, amount: item.amount, description: item.description || '', date: item.date.toISOString().slice(0, 10) })));
  document.end();
}

module.exports = { writePdf };