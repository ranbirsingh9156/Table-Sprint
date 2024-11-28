const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware'); //for protected routes later
const productController = require('../controllers/productController');

// @route   POST api/products
// @desc    Create a product
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      //other checks as required
    ],
  ],
  productController.createProduct
);

//@route GET /api/products
router.get('/', productController.getAllProducts);

// @route   GET api/products/:id
// @desc    Get product by ID
router.get('/:id', productController.getProductById);

// @route   PUT api/products/:id
// @desc    Update a product
router.put('/:id', auth, productController.updateProduct);

// @route    DELETE api/products/:id
// @desc     Delete a product
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
