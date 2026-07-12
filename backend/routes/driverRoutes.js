const express = require('express');
const router = express.Router();
const {
  createDriver,
  getDrivers,
  getEligibleDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// All routes below require login
router.use(protect);

// Any logged-in role can view drivers / eligible drivers (needed for trip creation, dashboards etc.)
router.get('/', getDrivers);
router.get('/eligible', getEligibleDrivers);
router.get('/:id', getDriverById);

// Fleet Manager and Safety Officer can create/edit drivers (Safety Officer manages license/safety score)
router.post('/', authorize('FleetManager', 'SafetyOfficer'), createDriver);
router.put('/:id', authorize('FleetManager', 'SafetyOfficer'), updateDriver);

// Only Fleet Manager can delete a driver record
router.delete('/:id', authorize('FleetManager'), deleteDriver);

module.exports = router;
