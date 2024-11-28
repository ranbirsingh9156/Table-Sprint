const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // Import validation middleware
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // Import the middleware

const crypto = require('crypto'); // Import crypto for generating random tokens
const nodemailer = require('nodemailer');
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(), // Email validation
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }), //Password validation
  ],
  authController.register // Controller function (we'll define this next)
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login //call the login from controller
);

router.get('/user', auth, async (req, res) => {
  //Apply 'auth' middleware for route protection
  try {
    const user = await User.findById(req.user.id).select('-password'); //Find user by decoded ID
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      //find user with the given token and expiry time
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, //token must be not expired
    });

    if (!user) {
      //if not found
      return res.status(400).json({ message: 'Invalid or expired token.' }); //send error message
    }

    user.password = password; //update password and related fields

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save(); //save to database

    res.status(200).json({ message: 'Password reset successful.' }); //send response to the client
  } catch (error) {
    console.error('Password reset error:', error); //log the error for debugging
    res
      .status(500)
      .json({
        message:
          error?.message || 'Failed to reset password. Please try again later.',
      }); //send error response
  }
});

module.exports = router;
