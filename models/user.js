
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Define the model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String,
  name: String,
  surname: String,
});

// On save Hook, encrypt password
// before saveing the model, run this function
userSchema.pre('save', function(next) {
  // get access to user model
  const user = this; // user.email or user.password
  // generate a selt than run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err) };
    // hash (encrypt) password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) { return next(err) };
      // overwrite plain text password with encrypted password
      user.password = hash;
      // carry on and save the password
      next();
    });
  });
});

// add global method to user Schema, compate if password matches
userSchema.methods.comparePassword = function(candidatePassword, callback) {

  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) { return callback(err) };
    callback(null, isMatch);
  });

};

// Create the model class
const ModelClass = mongoose.model('users', userSchema);
//                                 ^^collection name in DB
module.exports = ModelClass;
