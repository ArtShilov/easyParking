const router = require('express').Router()
const Organization = require('../models/organization')
const bcrypt = require("bcrypt");
const Parking = require('../models/parking')
const { sessionOrgChecker } = require("../middleware/auth");
const { validationResult } = require("express-validator")

const { registerValidators, addParkingValidators, loginOrgCalidators } = require('../utils/validators')


const saltRounds = 10;

router.get('/', sessionOrgChecker, (req, res) => {
  res.render('organization/loginOrg')
})

router.get('/dashboard', async (req, res) => {
  if (req.session.organization) {
    const { organization } = req.session;
    const parking = await Parking.find()
    res.render('organization/dashboard', { name: organization.name, logged: true, parking, logout: "org/logout"  });
  } else {
    res.redirect('/org');
  }
});

//регистрация организации
router.get('/register', sessionOrgChecker, (req, res) => {
  res.render('organization/signupOrg', {
    error: req.flash('error')
  })
})

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { name, phone, email, password } = req.body
    const candidate = await Organization.findOne({ phone })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg)
      return res.status(422).redirect('/org/register')
    }

    if (candidate) {
      req.flash('error', 'Пользователь с таким номером уже существует')
      res.redirect('/org/register')
    } else {
      console.log(1111);

      const organization = await new Organization({
        name,
        phone,
        email,
        password: await bcrypt.hash(password, saltRounds)
      }).save()
      req.session.organization = organization;
      console.log(req.session.organization);
      req.session.save(err => {
        if (err) {
          throw err
        }
      })
      res.redirect("/org/dashboard");
    }
  } catch (e) {
    console.log(e);
  }
})

router.get('/login', sessionOrgChecker, (req, res) => {
  res.render('organization/loginOrg', {
    error: req.flash('error')
  })
})

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    const organization = await Organization.findOne({ phone })

    if (organization) {
      const pass = await bcrypt.compare(password, organization.password)
      if (pass) {
        req.session.organization = organization;
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/org/dashboard');
        })
      } else {
        req.flash('error', 'Неверный пароль')
        res.redirect('/org/login')
      }
    } else {
      req.flash('error', 'Пользователя с таким номером не существует')
      res.redirect('/org/login');
    }
  } catch (e) {
    console.log(e);
  }
})

router.get('/logout', async (req, res, next) => {

  if (req.session.organization) {
    try {
      req.session.destroy(() => {
        res.redirect("/org/login");
      });

    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/org/login");
  }
});

router.get('/parking', async (req, res) => {
  const idOrg = req.session.organization._id;

  const parking = await Parking.find({ organizationId: idOrg })


router.get('/parking', async (req, res) => {
  const parking = await Parking.find()
  
  res.render('organization/parking', { parking, logout: "org/logout", logged: true })

})

router.get('/newParking', async (req, res) => {
  res.render('organization/addParking', {logout: "org/logout", logged: true})
})

router.post('/add', addParkingValidators, async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('organization/addParking', {
      error: errors.array()[0].msg,
      data: {
        name: req.body.name,
        position: req.body.position,
        description: req.body.description,
        countAll: req.body.description,
        price: req.body.price,

      }
    })
  }

  const { name, position, description, countAll, price, latitude, longitude } = req.body
  const parking = await new Parking({
    name,
    position,
    description,
    countAll,
    countNow: countAll,
    price,
    organizationId: req.session.organization._id,
    latitude,
    longitude
  }).save()

  const idOrg = req.session.organization._id
  const organization = await Organization.findById({ _id: idOrg })
  const newArr = organization.parkingId
  newArr.push(parking._id)
  organization.parkingId = newArr
  await organization.save()

  res.redirect('/org')

})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const parking = await Parking.findById(id)
  res.render('organization/oneParking', { parking, logout: "org/logout", logged: true })
})

router.post('/delete', async (req, res) => {
  const idParking = req.body.id
  const parking = await Parking.findByIdAndDelete(idParking)

  //логика удаления idParking из Organizaton
  const orgId = req.session.organization._id
  const organization = await Organization.findById(orgId)
  const newArr = organization.parkingId
  const arr = newArr.filter(i => i.toString() != idParking)
  organization.parkingId = arr
  await organization.save()
  res.redirect('/org/dashboard')
})

//изменение парковки
router.post('/edit', async (req, res) => {
  const { name, position, description, countAll, price, dataset, id } = req.body;
  if (name == '' || position == '' || description == '' || countAll == '' || price == '' || dataset == '' || id == '') {
    return res.json({ status: '400' })
  } else {
    const parkingNow = await Parking.findByIdAndUpdate({ _id: id }, { name, position, description, countAll, price, dataset })
    await parkingNow.save()
    return res.json({ status: '200' })
  }
})

module.exports = router
