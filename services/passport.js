
const passport = require('passport');
const UserModelClass = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');

// Setup options for Jwt Strategy
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
// Create Jwt Startegy
const jwtLogin = new JwtStrategy(JwtOptions, function(payload, done) {
  // see if the user ID in the payload exists in BD
  UserModelClass.findById(payload.sub, function(err, user) {
    if(err) { return next(err, false) };

    if(user) {
      // If it does, call 'done' with user object
      done(null, user);
    } else {
      // otherwise call 'done' without object
      done(null, false);
    }
  });

});

// Tell Passport to use this startegy
passport.use(jwtLogin);
