const Product = require('../models/Product'); //make sure to create Product model
const { validationResult } = require('express-validator');

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //send bad request
  }

  try {
    const newProduct = new Product({
      //Data from request body
      name: req.body.name,
      description: req.body.description, //Add other fields as per your schema
      price: req.body.price,
      category: req.body.category,
      subCategory: req.body.subCategory,
      // ... other fields from your Product model
    });

    const product = await newProduct.save(); //Save product

    res.status(201).json(product); //send successful response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Other controller functions for get, update, delete will go here.

module.exports = {
  createProduct,
  // ... other controller functions ...
};
