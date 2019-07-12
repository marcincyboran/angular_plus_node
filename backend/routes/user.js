const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).send(allUsers);
  } catch (ex) {
    res.status(500).send('Something went wrong...');    
  }
})

router.post('/signup', async (req, res) => {

  const passHash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: passHash
  });

  try {
    user = await user.save();
    res.status(200).send(user);
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong...');
  }
});


module.exports = router;
