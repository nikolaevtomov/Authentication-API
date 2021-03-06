
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
    ok: true,
    token: tokenForUser(req.user),
    email: req.user.email,
    name: req.user.name,
    surname: req.user.surname,
  });
}

exports.register = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;


  // Check if email and password have been provided
  if(!email || !password || !name || !surname) {
    return res.status(422).send({ error: 'You must provide email, password name and surname!' });
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
      password: password,
      name: name,
      surname: surname,
    });

    newUser.save(function(err) {
      if(err) { return next(err) };

      // Respond to request indicating the user was created
      res.json({
        ok: true,
        token: tokenForUser(newUser), 
      });
    });

  });

}
