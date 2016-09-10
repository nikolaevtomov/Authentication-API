
const passport = require('passport');
const Authentication = require('./controllers/authentication');
const PassportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: true });
const requireLogin = passport.authenticate('local', { session: true, failureFlash: true });

module.exports = function(app) {

  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret Authentication Api!' });
  });
  app.post('/login', requireLogin, Authentication.login);
  app.post('/register', Authentication.register);

}
