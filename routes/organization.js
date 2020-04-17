const router = require('express').Router()
const Organization = require('../models/organization')
const bcrypt = require("bcrypt");
const Parking = require('../models/parking')
const { sessionOrgChecker } = require("../middleware/auth");

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
  res.render('organization/signupOrg')
})

router.post('/register', async (req, res) => {
  console.log(req.session)
  const { name, phone, password } = req.body
  const organization = await new Organization({
    name,
    phone,
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
})

router.get('/logout', async (req, res, next) => {

  if (req.session.organization) {
    try {
      await req.session.destroy(() => {
        res.redirect("/org");
      });

    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/org/login");
  }
});

router.get('/login', sessionOrgChecker, (req, res) => {
  res.render('organization/loginOrg')
})

router.post('/login', sessionOrgChecker, async (req, res) => {
  const { name, password } = req.body
  const organization = await Organization.findOne({ name })

  if (organization && (await bcrypt.compare(password, organization.password))) {
    req.session.organization = organization;
    res.redirect('/org/dashboard');
  } else {
    res.redirect('/org/login');
  }
})

router.get('/parking', async (req, res) => {
  const parking = await Parking.find()
  
  res.render('organization/parking', { parking, logout: "org/logout", logged: true })
})

router.get('/newParking', async (req, res) => {
  res.render('organization/addParking', {logout: "org/logout", logged: true})
})

router.post('/add', async (req, res) => {  
  const { name, position, description, countAll, countNow, price, password } = req.body
  const parking = await new Parking({
    name,
    position,
    description,
    countAll,
    countNow,
    price,
    password,
    organizationId: req.session.organization._id
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

router.post('/edit', async (req, res) => {
  const idParking = req.body.id

  
  res.redirect('/org/dashboard')
})

module.exports = router
