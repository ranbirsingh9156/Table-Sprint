const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const rbac = require('../middleware/rbacMiddleware');  // Import the RBAC middleware
const userController = require('../controllers/usersController')


// Allow only users with the 'admin' role to access this route
router.get('/', auth, rbac(['admin']),userController.getAllUsers);  //Example for admin only route



module.exports = router;