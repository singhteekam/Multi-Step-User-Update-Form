// routes/formRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Location = require("../models/Location");

const multer = require('multer');
const User = require('../models/User');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /api/users
router.post('/submit', upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      username,
      currentPassword,
      newPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter,
      dob,
      gender,
      customGender,
    } = req.body;

    console.log(req.body)

    const profilePhoto = req.file ? req.file.filename : null;

    const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const newUser = new User({
      profilePhoto,
      username,
      currentPassword:hashedCurrentPassword,
      newPassword: hashedNewPassword,
      profession,
      companyName,
      addressLine1,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter: newsletter === 'true',
      dob,
      gender,
      customGender,
    });

    await newUser.save();
    res.status(201).json({ message: 'User saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/countries
router.get('/countries', async (req, res) => {
  const countryList = await Location.find({}, { code: 1, name: 1 });
  res.json(countryList);
});

// GET /api/states?country=IN
router.get('/states', async(req, res) => {
  const { country } = req.query;
  const result = await Location.findOne({ code: country });
  res.json(result?.states || []);
});

// GET /api/cities?state=Maharashtra
router.get('/cities',async (req, res) => {
  const { country, state } = req.query;
  const result = await Location.findOne({ code: country });
  const stateObj = result?.states.find((s) => s.code === state);
  const cities= stateObj?.cities || []
  res.json(cities);
});

// GET /api/check-username?username=test123
router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  let available = true;
  const user = await User.findOne({ username });
  if(user){
    available = false;
  }
  res.json( {available} );
});

module.exports = router;
