const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
//you can add more fields here if you need like description
});



module.exports = mongoose.model('Category', categorySchema);