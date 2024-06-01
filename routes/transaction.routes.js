const router = require("express").Router();

const transporter = require('../config/transporter.config');

const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");

const isAuthenticated = require("../middlewares/isAuthenticated");

// POST 'api/account/send' => Crea una nueva transacción y envia un email al destinatario
router.post("/send", isAuthenticated, async (req, res, next) => {
  
  const { to, amount, concept } = req.body;
  const { _id, username } = req.payload;

  if (!to || !amount || !concept) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ errorMessage: "Amount must be greater than 0" });
    return;
  }
  
  try {
    const userfunds = await User.findById(_id).select("funds");
    await User.findByIdAndUpdate(_id, { $inc: { funds: -amount } }, { new: true });
    await User.findByIdAndUpdate(to, { $inc: { funds: amount } }, { new: true });

    if (userfunds.funds < amount) {
      res.status(400).json({ errorMessage: "You don't have enough funds" });
      return;
    }

    await Transaction.create({
      from: _id,
      to,
      amount,
      concept,
    });

    const emailTo = await User.findById(to).select("email");
    const emailFrom = await User.findById(_id).select("email");

    const usernameUpper = username.charAt(0).toUpperCase() + username.slice(1);

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emailTo.email,
      subject: `You have received a new transaction from ${usernameUpper}`,
      html: `<h1>You have received a new transaction</h1>
      <p>From: ${emailFrom.email}</p>
      <p>Amount: ${amount}€</p>
      <p>Concept: ${concept}</p>
      <img src="https://res.cloudinary.com/ddaezutq8/image/upload/v1693738024/finapayLogoSinFondo_eiisg7.png" alt="finapay" width="400px" />
      `,
    });

    res.status(200).json("Transaction successfully created");
  } catch (error) {
    next(error);
  }
});

module.exports = router;