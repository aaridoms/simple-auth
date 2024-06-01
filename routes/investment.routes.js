const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const Investment = require("../models/Investment.model");
const User = require("../models/User.model");
const Operation = require("../models/Operation.model");

// GET '/api/account/investments' => Get all investments
router.get("/investments", isAuthenticated, async (req, res, next) => {
  try {
    const allInvestment = await Investment.find();
    res.status(200).json(allInvestment);
  } catch (error) {
    next(error);
  }
});

// POTS '/api/account/investments/add' => Add a new investment
router.post("/investments/add", isAuthenticated, async (req, res, next) => {
  const { name, risk, interesRate, category, duration, notes } = req.body;

  if(!name || !risk || !interesRate || !category || !duration || !notes) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  if (interesRate <= 0) {
    res.status(400).json({ errorMessage: "Interest rate must be greater than 0" });
    return;
  }

  if (duration <= 0) {
    res.status(400).json({ errorMessage: "Duration must be greater than 0" });
    return;
  }

  try {
    await Investment.create({
      name,
      risk,
      interesRate,
      category,
      duration,
      notes,
    });

    res.status(200).json("Investment created successfully");
  } catch (error) {
    next(error);
  }
});

// DELETE '/api/account/investments/:investmentId/delete' => Delete an investment
router.delete(
  "/investments/:investmentId/delete",
  isAuthenticated,
  async (req, res, next) => {
    const { investmentId } = req.params;

    try {
      await Investment.findByIdAndDelete(investmentId);
      res.status(200).json("Investment deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

// POST '/api/account/investments/:investmentId/join => user can join an investment
router.post(
  "/investments/:investmentId/join",
  isAuthenticated,
  async (req, res, next) => {
    const { investmentId } = req.params;
    const { _id } = req.payload;
    const { amount } = req.body;

    if (!amount) {
      res.status(400).json({ errorMessage: "Please, fill in all fields" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ errorMessage: "Amount must be greater than 0" });
      return;
    }

    try {
      const oneInvestment = await Investment.findById(investmentId);

      const userFunds = await User.findById(_id).select({ funds: 1 });

      if (userFunds.funds < amount) {
        res.status(400).json({ errorMessage: "You do not have enough funds" });
        return;
      }

      const newOperation = await Operation.create({
        amount,
      });

      const operationID = newOperation._id;
      await User.findByIdAndUpdate(
        _id,
        { $inc: { funds: -amount }, $push: { operation: operationID } },
        { new: true }
      );

      const interval = setInterval(async () => {
        const randomNumber = Math.floor(Math.random() * 100);
        try {
          if (oneInvestment.risk === "Low") {
            if (randomNumber <= 3) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
            }
          } else if (oneInvestment.risk === "Medium") {
            if (randomNumber <= 10) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
            }
          } else if (oneInvestment.risk === "High") {
            if (randomNumber <= 25) {
              const newFunds = amount * (1 - oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
            } else {
              const newFunds = amount * (1 + oneInvestment.interesRate * 0.01);
              await User.findByIdAndUpdate(
                _id,
                { $inc: { funds: newFunds } },
                { new: true }
              );
              await Operation.findByIdAndUpdate(
                operationID,
                { status: "Completed" , earnings: newFunds-amount },
                { new: true }
              );
            }
          }
          clearInterval(interval);
        } catch (error) {
          console.log(error);
          await User.findByIdAndUpdate(
            _id,
            { $inc: { amount } },
            { new: true }
          );
          await Operation.findByIdAndUpdate(operationID, {
            status: "Failed",
          });
        }
      }, 1000 * oneInvestment.duration);

      res.status(201).json("joined");
    } catch (error) {
      next(error);
    }
  }
);

// GET '/api/account/investments/user-investment' => Get all investments of the user
router.get(
  "/investments/user-investment",
  isAuthenticated,
  async (req, res, next) => {
    const { _id } = req.payload;

    try {
      const userInvestments = await User.findById(_id).populate("operation");
      const sortedOperation = userInvestments.operation.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
      res.status(200).json(sortedOperation);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE '/api/account/investments/:investmentId/delete' => Delete an investment
router.delete("/investments/:investmentId/delete", isAuthenticated, async (req, res, next) => {
  
  const { investmentId } = req.params;

  try {
    await Investment.findByIdAndDelete(investmentId);
    res.status(200).json("Investment deleted successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
