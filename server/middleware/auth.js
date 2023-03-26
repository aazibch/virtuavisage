const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const AppError = require('../utils/AppError');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      if (!email || !password) {
        return done(null, false, {
          error: new AppError(
            'Please provide an email address and password.',
            400
          )
        });
      }

      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.isPasswordCorrect(password, user.password))) {
        return done(null, false, {
          error: new AppError('Incorrect email address or password.', 401)
        });
      }

      user.password = undefined;

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
