const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/v1/users/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) return done(null, user);

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value
        });

        done(null, newUser);
        return done(null, profile);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
