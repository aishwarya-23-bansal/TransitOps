const Fuel = require('../models/Fuel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const getFuelById = async (id) => {
  const fuel = await Fuel.findById(id);
  if (!fuel) throw new ApiError(404, 'Fuel log not found.');
  return fuel;
};

exports.createFuel = asyncHandler(async (req, res) => res.status(201).json(await Fuel.create(req.body)));
exports.getFuels = asyncHandler(async (req, res) => res.json(await Fuel.find().sort({ date: -1 })));
exports.getFuel = asyncHandler(async (req, res) => res.json(await getFuelById(req.params.id)));
exports.updateFuel = asyncHandler(async (req, res) => {
  const fuel = await Fuel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!fuel) throw new ApiError(404, 'Fuel log not found.');
  res.json(fuel);
});
exports.deleteFuel = asyncHandler(async (req, res) => {
  const fuel = await Fuel.findByIdAndDelete(req.params.id);
  if (!fuel) throw new ApiError(404, 'Fuel log not found.');
  res.status(204).send();
});
