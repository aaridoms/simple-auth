const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transporter = require('../config/transporter.config');

const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");

// POST 'api/auth/signup' => Registra un nuevo usuario
router.post("/signup", async (req, res, next) => {

  const { username, email, password, repitPassword } = req.body;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if (!username || !email || !password || !repitPassword) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }

  if (!regexEmail.test(email)) {
    res.status(400).json({ errorMessage: "Please, enter a valid email" });
    return;
  }

  if (!regexPassword.test(password)) {
    res.status(400).json({ errorMessage: "Please, enter a valid password" });
    return;
  }

  if (password !== repitPassword) {
    res.status(400).json({ errorMessage: "Passwords don't match" });
    return;
  }

  try {

    const foundUser = await User.findOne({ $or: [{ username }, { email }] });

    if (foundUser) {
      res.status(400).json({ errorMessage: "Username or email already in use" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });

    const emailTo = await User.findOne({ email }).select("email");
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emailTo.email,
      subject: `Welcome to Finapay!`,
      html: `<h1>Welcome to Finapay</h1>
      <p>Thanks for joining us!</p>
      <img src="https://res.cloudinary.com/ddaezutq8/image/upload/v1693738024/finapayLogoSinFondo_eiisg7.png" alt="finapay" width="400px" />
      `,
    });

    res.status(200).json("User created successfully");
  } catch (error) {
    next(error);
  }
});

// POST 'api/auth/login' => Inicia sesión con un usuario existente
router.post("/login", async (req, res, next) => {
  
  const { email, password, isChecked } = req.body;

  if (!email || !password) {
    res.status(400).json({ errorMessage: "Please, fill in all fields" });
    return;
  }
  
  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res.status(400).json({ errorMessage: "Email does not exist" });
      return;
    }

    const isSamePassword = await bcrypt.compare(password, foundUser.password);

    if (!isSamePassword) {
      res.status(400).json({ errorMessage: "Incorrect password" });
      return;
    }

    const payload = {
      _id: foundUser._id,
      role: foundUser.role,
      username: foundUser.username,
    };

    let authToken;

    if(isChecked === true) {
      authToken = jwt.sign(payload, process.env.SECRET_TOKEN,
        { expiresIn: "7d", algorithm: "HS256" });

    } else {
      authToken = jwt.sign(payload, process.env.SECRET_TOKEN,
        { expiresIn: "1h", algorithm: "HS256" });
    }


    res.json({ authToken });

  } catch (error) {
    next(error);
  }
});

// GET 'api/auth/verify' => Verifica si el usuario está logueado
router.get("/verify", isAuthenticated, (req, res, next) => {

  res.json(req.payload);
});

module.exports = router;