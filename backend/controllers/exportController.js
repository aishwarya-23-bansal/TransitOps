const reportService = require('../services/reportService');
const { generateCsv } = require('../utils/csvGenerator');
const { writePdf } = require('../utils/pdfGenerator');
const { asyncHandler } = require('../middlewares/errorHandler');

exports.exportCsv = asyncHandler(async (req, res) => {
  const report = await reportService.getReportData();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.attachment('transitops-report.csv');
  res.send(generateCsv(report));
});

exports.exportPdf = asyncHandler(async (req, res) => {
  const report = await reportService.getReportData();
  res.setHeader('Content-Type', 'application/pdf');
  res.attachment('transitops-report.pdf');
  writePdf(res, report);
});
