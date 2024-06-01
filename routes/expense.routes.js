const router = require("express").Router();
const Expense = require("../models/Expense.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");

// GET '/api/account/expenses' => Get all expenses
router.get("/expenses", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const response = await User.findById(_id).populate("expenses");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET '/api/account/expenses/:idExpense/details' => Get a specific expense
router.get(
  "/expenses/:idExpense/details",
  isAuthenticated,
  async (req, res, next) => {
    const { idExpense } = req.params;

    try {
      const response = await Expense.findById(idExpense);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST '/api/account/expenses/add' => Create a new expense
router.post("/expenses/add", isAuthenticated, async (req, res, next) => {
  const { name, amount, category, notes } = req.body;
  const { _id } = req.payload;

  if(!name || !amount || !category) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  try {
    const response = await Expense.create({
      name,
      amount,
      category,
      notes,
    });

    await User.findByIdAndUpdate(_id, { $push: { expenses: response._id } },{ new: true }
    );

    res.status(200).json("Expense successfully created");
  } catch (error) {
    next(error);
  }
});

// DELETE '/api/account/expenses/:idExpense/delete' => Delete a specific expense
router.delete("/expenses/:idExpense/delete", isAuthenticated, async (req, res, next) => {

  const { idExpense } = req.params;
  const { _id } = req.payload;

  try {
    await Expense.findByIdAndDelete(idExpense);

    await User.findByIdAndUpdate(_id, { $pull: { expenses: idExpense } });

    res.status(200).json("Expense successfully deleted");
  } catch (error) {
    next(error);
  }
});

// PUT '/api/account/expenses/:idExpense/edit' => Edit a specific expense
router.put("/expenses/:idExpense/edit", isAuthenticated, async (req, res, next) => {

  const { idExpense } = req.params;
  const { name, amount, category, notes } = req.body;

  if(!name || !amount || !category) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  try {
    await Expense.findByIdAndUpdate(idExpense, { name, amount, category, notes }, { new: true });

    res.status(200).json("Expense successfully updated");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
