
const passport = require('passport');
const Authentication = require('./controllers/authentication');
const PassportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret Authentication Api!' });
  });
  app.post('/login', requireLogin, Authentication.login);
  app.post('/register', Authentication.register);

}
