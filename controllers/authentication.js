
const jwt = require('jwt-simple');
const UserModelClass = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  //     jwt props->  ^^subject to, ^^issued at time
}

exports.login = function(req, res, next) {
  // User email and password has already been authenticated
  // give a token and data (response)
  res.send({
    message: 'OK',
    error: false,
    token: tokenForUser(req.user),
    data: 'data'
  });
}

exports.register = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  // Check if email and password have been provided
  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password!' });
  }

  // Check if the user is axist
  UserModelClass.findOne({ email: email }, function(err, existingUser) {

    if(err) { return next(err) };

    // If user is already registered, return a message
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
