const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const userRoutes = require("./user.routes");
router.use("/account", userRoutes);

const transactionRoutes = require("./transaction.routes");
router.use("/account", transactionRoutes);

const expenseRoutes = require("./expense.routes");
router.use("/account", expenseRoutes);

const investmentRoutes = require("./investment.routes");
router.use("/account", investmentRoutes);

module.exports = router;
