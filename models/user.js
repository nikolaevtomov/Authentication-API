const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

// Create the model class
const ModelClass = mongoose.model('users', userSchema);
//                                 ^^collection
//                                   name in DB

// Export the module
module.exports = ModelClass;
