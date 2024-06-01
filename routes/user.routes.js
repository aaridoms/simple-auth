const router = require("express").Router();

const User = require("../models/User.model");
const Transaction = require("../models/Transaction.model");

const isAuthenticated = require("../middlewares/isAuthenticated");
const uploader = require("../middlewares/cloudinary.config");

// GET 'api/account/summary' => to get the summary of the user
router.get("/summary", isAuthenticated ,async (req, res, next) => {

  const { _id } = req.payload;

  try {
    const foundUser = await User.findById(_id).populate("expenses")
    const foundTransaction = await Transaction.find({ $or: [{ from: _id }, { to: _id }] }).populate("from").populate("to").sort({ createdAt: -1 })
    const allUsers = await User.find({_id: { $ne: _id }})

    res.json({foundUser, foundTransaction, allUsers});
  } catch (error) {
    next(error);
  }
});

// POST 'api/account/add-funds' => to add funds to the user
router.post("/add-funds", isAuthenticated, async (req, res, next) => {

  const { funds } = req.body;
  const { _id } = req.payload;

  if(!funds) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  if (funds <= 0) {
    res.status(400).json({ errorMessage: "Funds must be greater than 0" });
    return;
  }

  try {
    await User.findByIdAndUpdate(_id, { $inc: { funds: funds } }, { new: true });
    res.json("Funds successfully added");
  } catch (error) {
    next(error);
  }
});

// GET '/api/account/profile' => to get the profile of the user
router.get("/profile", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const foundUser = await User.findById(_id);

    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH '/api/account/profile/edit-email' => to edit the profile of the user
router.patch("/profile/edit-email", isAuthenticated, async (req, res, next) => {

  const { email } = req.body;
  const { _id } = req.payload;
  const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if(!email) {
    res.status(400).json({ errorMessage: "Please, fill the email field" });
    return;
  }

  if(regexEmail.test(email) === false) {
    res.status(400).json({ errorMessage: "Please, enter a valid email" });
    return;
  }

  try {
    const response = await User.findByIdAndUpdate(_id, {email}, { new: true });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST '/api/account/profile/edit-img' => to edit the profile image of the user
router.post("/profile/edit-img", isAuthenticated, uploader.single("image"), async (req, res, next) => {
  
  const { _id } = req.payload;

  try {

  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  await User.findByIdAndUpdate(_id, { profilePic: req.file.path }, { new: true })

  } catch (error) {
    next(error);
  }

  res.json({ imageUrl: req.file.path });
});

module.exports = router;