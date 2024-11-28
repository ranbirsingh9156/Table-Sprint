const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // Import validation middleware
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // Import the middleware

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

module.exports = router;
