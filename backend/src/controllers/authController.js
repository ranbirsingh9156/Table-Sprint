const User = require('../models/User');
const { validationResult } = require('express-validator'); // Import for validation results
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' }); // Check for existing user
    }

    user = new User({
      email,
      password,
    });

    await user.save(); // Save to database

    //JWT token generation and response

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); //Handle errors gracefully
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare passwords

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); // Incorrect password
    }

    // JWT Payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    //Sign the JWT token and send as response
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, //Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  register,
  login,
};
