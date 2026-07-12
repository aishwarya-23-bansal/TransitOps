const router = require('express').Router();
const controller = require('../controllers/analyticsController');

router.get('/operational-cost', controller.operationalCosts);
router.get('/fuel-efficiency', controller.fuelEfficiency);
router.get('/fleet-utilization', controller.fleetUtilization);
router.get('/vehicle-roi', controller.vehicleRoi);
router.get('/dashboard', controller.dashboard);

module.exports = router;
