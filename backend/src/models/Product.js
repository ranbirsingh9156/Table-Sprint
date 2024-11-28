const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,   
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  imageUrl: {
    type: String,
  },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    sequence:{
        type:Number
    },

});


module.exports = mongoose.model('Product', productSchema);