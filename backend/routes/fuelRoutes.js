const router = require('express').Router();
const controller = require('../controllers/fuelController');
const { validateFuel, validateFuelUpdate, validateObjectId } = require('../middlewares/validators');

router.route('/').post(validateFuel, controller.createFuel).get(controller.getFuels);
router.route('/:id').get(validateObjectId, controller.getFuel).put(validateObjectId, validateFuelUpdate, controller.updateFuel).delete(validateObjectId, controller.deleteFuel);

module.exports = router;
