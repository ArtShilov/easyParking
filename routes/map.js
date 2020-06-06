const express = require('express');

const router = express.Router();
const User = require('../models/users');
const Parking = require('../models/parking');


router.get('/', (req, res) => {
  const { user } = req.session;
  if (req.session.user) {
    res.render('map/index', {
      name: user.firstName, map: true, logged: true, logout: '/logout',
    });

  } else {
    res.redirect('/login');
  }
});

router.get('/reserv/:id', async (req, res) => {
  const { id } = req.params;
  const parking = await Parking.findById(id);
  res.render('map/parking', {
    parking,
    logged: true,
    logout: '/org/logout',
  });
});

router.post('/reserv', async (req, res) => {
  const { id } = req.body;
  const parking = await Parking.findById(id);
  parking.countNow -= 1;
  await parking.save();
  const reservedTime = req.body.time;
  res.render('/map', { reservedTime, logged: true });
});


router.get('/reserv/:id', async (req, res) => {
  const { id } = req.params;
  const parking = await Parking.findById(id);
  res.render('map/parking', {
    parking,
  });
});


router.post('/reserv', async (req, res) => {
  const { id } = req.body;
  const parking = await Parking.findById(id);
  parking.countNow -= 1;
  await parking.save();
  const reservedTime = req.body.time;
  res.render('/map', { reservedTime, logged: true });
});


module.exports = router;
