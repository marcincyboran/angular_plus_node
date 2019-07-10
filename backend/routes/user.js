const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('', (req, res) => {

});

router.post('/signup', async (req, res) => {
  const passHash = bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: passHash
  });

  try {
    user = user.save();
    res.status(201).send(user);
  } catch (ex) {
    res.status(500).send('Something went wrong', ex);
  }
});


module.exports = router;
