const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { apiUrl } = require('../constants');

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

      const user = await User.findOne({ email }).select('+password +authType');

      if (
        !user ||
        user.authType !== 'local' ||
        !(await user.isPasswordCorrect(password, user.password))
      ) {
        return done(null, false, {
          error: new AppError('Incorrect email address or password.', 401)
        });
      }

      user.authType = undefined;
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
      callbackURL: `${apiUrl}/v1/users/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('[passport auth middleware] profile', profile);
        const user = await User.findOne({
          email: profile.emails[0].value
        }).select('authType');

        console.log('[auth middleware] user', user);

        if (user?.authType === 'google') return done(null, user);

        if (!user || user.authType !== 'google') {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            authType: 'google'
          });

          return done(null, newUser);
        }

        done(null, false);
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
