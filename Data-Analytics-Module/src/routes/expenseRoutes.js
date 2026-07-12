const router = require('express').Router();
const controller = require('../controllers/expenseController');
const { validateExpense, validateExpenseUpdate, validateObjectId } = require('../middlewares/validators');

router.route('/').post(validateExpense, controller.createExpense).get(controller.getExpenses);
router.route('/:id').get(validateObjectId, controller.getExpense).put(validateObjectId, validateExpenseUpdate, controller.updateExpense).delete(validateObjectId, controller.deleteExpense);

module.exports = router;
