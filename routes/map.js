const express = require("express");
const router = express.Router();
const User = require("../models/users");


router.get('/', (req, res) => {
    const { user } = req.session;
  if (req.session.user) {
    // console.log(req.session.user);

    res.render("map/index", { name: user.firstName });
  } else {
    res.redirect("/login");
  }

});

module.exports = router;
