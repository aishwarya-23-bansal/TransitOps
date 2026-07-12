const mongoose = require('mongoose');
const { ApiError } = require('./errorHandler');

const isPositive = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const isValidDate = (value) => value === undefined || value === null || !Number.isNaN(new Date(value).getTime());

function validateFuel(req, res, next, isUpdate = false) {
  const { vehicleId, liters, cost, date } = req.body;
  if ((!isUpdate && !vehicleId) || (vehicleId && !mongoose.isValidObjectId(vehicleId))) return next(new ApiError(400, 'vehicleId is required and must be a valid MongoDB id.'));
  if ((!isUpdate || liters !== undefined) && !isPositive(liters)) return next(new ApiError(400, 'liters must be greater than 0.'));
  if ((!isUpdate || cost !== undefined) && !isPositive(cost)) return next(new ApiError(400, 'cost must be greater than 0.'));
  if (!isValidDate(date)) return next(new ApiError(400, 'date must be a valid date.'));
  next();
}

function validateExpense(req, res, next, isUpdate = false) {
  const { vehicleId, amount, type, date } = req.body;
  if ((!isUpdate && !vehicleId) || (vehicleId && !mongoose.isValidObjectId(vehicleId))) return next(new ApiError(400, 'vehicleId is required and must be a valid MongoDB id.'));
  if ((!isUpdate || amount !== undefined) && !isPositive(amount)) return next(new ApiError(400, 'amount must be greater than 0.'));
  if ((!isUpdate || type !== undefined) && !['Toll', 'Parking', 'Other'].includes(type)) return next(new ApiError(400, 'type must be Toll, Parking, or Other.'));
  if (!isValidDate(date)) return next(new ApiError(400, 'date must be a valid date.'));
  next();
}

function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(400, 'Invalid resource id.'));
  next();
}

const validateFuelUpdate = (req, res, next) => validateFuel(req, res, next, true);
const validateExpenseUpdate = (req, res, next) => validateExpense(req, res, next, true);

module.exports = { validateFuel, validateFuelUpdate, validateExpense, validateExpenseUpdate, validateObjectId };