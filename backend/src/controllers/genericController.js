const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const createItem = (Model) => async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let newItem = new Model(req.body);

    //for handling nested sub category
    if (Model.modelName === 'SubCategory') {
      const category = await mongoose
        .model('Category')
        .findById(req.body.category);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      newItem.category = category;
    }

    const doc = await newItem.save();
    res.status(201).json(doc);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllItems = (Model) => async (req, res) => {
  try {
    const docs = await Model.find();
    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getItemById = (Model) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = (Model) => async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //this option returns updated document
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedDoc);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = (Model) => async (req, res) => {
  try {
    const deletedDoc = await Model.findByIdAndRemove(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
