const Driver = require('../models/Driver');

// @route POST /api/drivers
// @desc  Register a new driver
const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore } = req.body;

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ message: 'Missing required driver fields' });
    }

    const existing = await Driver.findOne({ licenseNumber });
    if (existing) {
      return res.status(400).json({ message: 'A driver with this license number already exists' });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore: safetyScore ?? 100,
    });

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/drivers
// @desc  Get all drivers (supports filter: ?status=Available)
const getDrivers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/drivers/eligible
// @desc  Get only drivers eligible for a trip:
// status must be Available, AND license must not be expired, AND not Suspended.
// IMPORTANT: Trip creation UI (Member 3) and Trip logic (Member 2) should use THIS endpoint.
const getEligibleDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: 'Available',
      licenseExpiryDate: { $gte: new Date() },
    }).sort({ name: 1 });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    if (req.body.licenseNumber) {
      const existing = await Driver.findOne({
        licenseNumber: req.body.licenseNumber,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({ message: 'License number already in use by another driver' });
      }
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getEligibleDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
