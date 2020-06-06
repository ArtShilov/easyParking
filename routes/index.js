const express = require("express");
const bcrypt = require("bcrypt");
const { sessionChecker } = require("../middleware/auth");
const { sessionOrgChecker } = require("../middleware/auth");
const User = require("../models/users");
const Parking = require('../models/parking');

const saltRounds = 10;
const router = express.Router();

router.get("/", sessionOrgChecker, sessionChecker, (req, res) => {
  res.redirect("/login");
});

router
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.render("auth/signup");
  })
  .post(async (req, res, next) => {

    const { firstName, lastName, phone, email, password } = req.body;
    if (firstName == '' || lastName == '' || phone == '' || email == '' || password == '') {
      const message = 'Нужно заполнить все поля'
      return res.render("auth/signup", { message }).end();
    } else {
      const user = new User({
        email,
        password: await bcrypt.hash(password, saltRounds),
        firstName,
        lastName,
        phone
      });
      await user.save();
      req.session.user = user;
      return res.redirect("/map");
    }
  }
  );

router
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("auth/login");
  })
  .post(async (req, res) => {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/map");
    } else {
      const message = 'Не совпадает телефон/пароль';
      res.render("auth/login", { message });
    }
  });

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/login");
  }
});

router.get('/allparking', async (req, res) => {
  const parkings = await Parking.find();
  console.log(parkings);
  res.json({ parkings });
});





module.exports = router;
