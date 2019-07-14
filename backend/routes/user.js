const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const loginUsersOnly = require('../middleware/auth');

const router = express.Router();

router.get('/', loginUsersOnly, async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).send(allUsers);
  } catch (ex) {
    res.status(500).send('Something went wrong...');
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(404).send('Cant find user with given data');

    const isPassValid = bcrypt.compare(req.body.password, user.password);

    if(!isPassValid) return res.status(401).send('Wrong password');

    const token = jwt.sign(
        {
          email: user.email,
          id: user._id
        },
        'secret_key_string_change_it_to_env',
        { expiresIn: '1h'}
      )

    res.status(200).send({message: 'Successful loged', token, expiresIn: 3600, userId: user._id });

  } catch (ex) {
    res.status(500).send({ message: 'Something went wrong...', info: ex});
  }
})

router.post('/signup', async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const addedUser = await user.save();
    res.status(200).send(addedUser);
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Something went wrong...');
  }
});


module.exports = router;
