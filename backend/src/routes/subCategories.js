const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const genericController = require('../controllers/genericController');
const SubCategory = require('../models/SubCategory');


const validateSubCategory=[
    check('name', 'Sub Category name is required').not().isEmpty(),
    check('category','Category is required').not().isEmpty()
  ]


router.post('/',auth, validateSubCategory, genericController.createItem(SubCategory));
router.get('/', genericController.getAllItems(SubCategory));
router.get('/:id', genericController.getItemById(SubCategory));
router.put('/:id',auth, validateSubCategory,genericController.updateItem(SubCategory));
router.delete('/:id',auth, genericController.deleteItem(SubCategory));

module.exports = router;