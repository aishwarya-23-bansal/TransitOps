const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  getEligibleVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// All routes below require login
router.use(protect);

// Any logged-in role can view vehicles / eligible vehicles (needed for trip creation, dashboards etc.)
router.get('/', getVehicles);
router.get('/eligible', getEligibleVehicles);
router.get('/:id', getVehicleById);

// Only Fleet Manager can create/edit/delete vehicles
router.post('/', authorize('FleetManager'), createVehicle);
router.put('/:id', authorize('FleetManager'), updateVehicle);
router.delete('/:id', authorize('FleetManager'), deleteVehicle);

module.exports = router;
