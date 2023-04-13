const passport = require('passport');
const catchAsync = require('../middleware/catchAsync');
const filterObject = require('../utils/filterObject');
const { clientUrl } = require('../constants/index');
const AppError = require('../utils/AppError');
const User = require('../models/User');

exports.signup = catchAsync(async (req, res, next) => {
  const filteredBody = filterObject(
    req.body,
    'name',
    'email',
    'password',
    'passwordConfirmation'
  );

  filteredBody.authType = 'local';

  const newUser = await User.create(filteredBody);
  newUser.password = undefined;

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }

    res.status(201).json({
      status: 'success',
      message: 'The account was created successfully.',
      data: {
        user: newUser
      }
    });
  });
});

exports.authenticateLocal = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) return next(info.error);
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        status: 'success',
        message: 'You were logged in successfully.',
        data: {
          user: req.user
        }
      });
    });
  })(req, res, next);
};

exports.authenticateGoogle = (req, res, next) => {
  passport.authenticate('google', function (err, user, info) {
    const authErrorUrl = `${clientUrl}/?alert_type="generic_auth_error"`;
    if (err) {
      return res.redirect(authErrorUrl);
    }
    req.login(user, (err) => {
      if (err) {
        return res.redirect(authErrorUrl);
      }
      return res.redirect(`${clientUrl}/?alert_type="auth_success"`);
    });
  })(req, res, next);
};

exports.protect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  next(new AppError('You are not logged in.', 401));
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'You were logged out successfully.'
    });
  });
};
