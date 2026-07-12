const analytics = require('../services/analyticsService');
const { asyncHandler } = require('../middlewares/errorHandler');

exports.operationalCosts = asyncHandler(async (req, res) => res.json(await analytics.operationalCosts()));
exports.fuelEfficiency = asyncHandler(async (req, res) => res.json(await analytics.fuelEfficiency()));
exports.fleetUtilization = asyncHandler(async (req, res) => res.json(await analytics.fleetUtilization()));
exports.vehicleRoi = asyncHandler(async (req, res) => res.json(await analytics.vehicleRoi()));
exports.dashboard = asyncHandler(async (req, res) => res.json(await analytics.dashboard()));
