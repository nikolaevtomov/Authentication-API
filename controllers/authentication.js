
const jwt = require('jwt-simple');
const UserModelClass = require('../models/user');
const config = require('../config');

function tokenForUser(newUser) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: newUser.id, iat: timestamp }, config.secret);
  //     jwt props->  ^^subject to,    ^^issued at time
}

exports.signup = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  // Check if email and password have been provided
  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password!' });
  }

  // Check if the user is axist
  UserModelClass.findOne({ email: email }, function(err, existingUser) {

    if(err) { return next(err) };

    // If user is already signed up, return a message
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use!' });
    }

    // If a user with unique email does NOT exist, create and save user record
    const newUser = new UserModelClass({
      email: email,
      password: password
    });

    newUser.save(function(err) {
      if(err) { return next(err) };

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(newUser) });
    });

  });

}
