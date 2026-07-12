const Vehicle = require('../models/Vehicle');

// @route POST /api/vehicles
// @desc  Register a new vehicle
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    if (!registrationNumber || !name || !type || !maxLoadCapacity || !acquisitionCost) {
      return res.status(400).json({ message: 'Missing required vehicle fields' });
    }

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing) {
      return res.status(400).json({ message: 'A vehicle with this registration number already exists' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      name,
      type,
      maxLoadCapacity,
      odometer: odometer || 0,
      acquisitionCost,
      region,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/vehicles
// @desc  Get all vehicles (supports filters: ?status=Available&type=Truck&region=North)
const getVehicles = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.region) filter.region = req.query.region;

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/vehicles/eligible
// @desc  Get only vehicles eligible for dispatch (Available status)
// IMPORTANT: Trip creation UI (Member 3) and Trip logic (Member 2) should use THIS endpoint,
// never the full vehicle list, so Retired/In Shop/On Trip vehicles never show up as selectable.
const getEligibleVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'Available' }).sort({ name: 1 });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    // Prevent changing registrationNumber to one that already exists on another vehicle
    if (req.body.registrationNumber) {
      const existing = await Vehicle.findOne({
        registrationNumber: req.body.registrationNumber,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({ message: 'Registration number already in use by another vehicle' });
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getEligibleVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
