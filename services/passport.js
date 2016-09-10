
const passport = require('passport');
const UserModelClass = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');

// Create Local Strategy
const localOptions = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify the user with username  (^^email, in this case) and password

  UserModelClass.findOne({ email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }

    // IF the email and password correct
    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false); }
      // otherwise call done with false
      return done(null, user);
    });

  });

});

// Setup options for Jwt Strategy
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
// Create Jwt Startegy
const jwtLogin = new JwtStrategy(JwtOptions, function(payload, done) {
  // see if the user ID in the payload exists in BD
  UserModelClass.findById(payload.sub, function(err, user) {
    if(err) { return done(err, false) };

    if(user) {
      // If it does, call 'done' with user object
      done(null, user);
    } else {
      // otherwise call 'done' without object
      done(null, false);
    }
  });

});

// Tell Passport to use this startegies
passport.use(localLogin);
passport.use(jwtLogin);
