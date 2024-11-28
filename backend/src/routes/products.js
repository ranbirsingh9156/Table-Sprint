const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware'); //for protected routes later
const productController = require('../controllers/productController');
const Product = require('../models/Product'); // Import the Product model
const genericController = require('../controllers/genericController');

// Define validation middleware for product creation/update
const validateProduct = [
  check('name', 'Product name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric().not().isEmpty(),
  check('category', 'Category is required').isMongoId().not().isEmpty(),
  check('subCategory', 'Subcategory is required').isMongoId().not().isEmpty(),
  check('status', 'Status must be either Active or Inactive').isIn([
    'Active',
    'Inactive',
  ]),
  check('sequence', 'sequence is required').isNumeric().not().isEmpty(),
  check('imageUrl', 'Image URL is required').not().isEmpty().isURL(),
];

router.post('/', auth, validateProduct, genericController.createItem(Product));
router.get('/', genericController.getAllItems(Product));
router.get('/:id', genericController.getItemById(Product));
router.put(
  '/:id',
  auth,
  validateProduct,
  genericController.updateItem(Product)
); //auth middleware applied
router.delete('/:id', auth, genericController.deleteItem(Product)); //auth middleware applied

module.exports = router;
