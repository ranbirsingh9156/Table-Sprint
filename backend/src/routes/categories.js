const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const genericController = require('../controllers/genericController');
const Category = require('../models/Category');


const validateCategory=[
    check('name','Category name is required').not().isEmpty()
]


router.post('/', auth, validateCategory, genericController.createItem(Category));
router.get('/', genericController.getAllItems(Category));
router.get('/:id', genericController.getItemById(Category));
router.put('/:id',auth, validateCategory, genericController.updateItem(Category));
router.delete('/:id', auth,genericController.deleteItem(Category));



module.exports = router;