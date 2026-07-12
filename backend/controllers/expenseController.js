const Expense = require('../models/Expense');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

const getExpenseById = async (id) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new ApiError(404, 'Expense not found.');
  return expense;
};

exports.createExpense = asyncHandler(async (req, res) => res.status(201).json(await Expense.create(req.body)));
exports.getExpenses = asyncHandler(async (req, res) => res.json(await Expense.find().sort({ date: -1 })));
exports.getExpense = asyncHandler(async (req, res) => res.json(await getExpenseById(req.params.id)));
exports.updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expense) throw new ApiError(404, 'Expense not found.');
  res.json(expense);
});
exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) throw new ApiError(404, 'Expense not found.');
  res.status(204).send();
});
