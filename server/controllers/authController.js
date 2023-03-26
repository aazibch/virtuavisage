const passport = require('passport');
const catchAsync = require('../middleware/catchAsync');
const filterObject = require('../utils/filterObject');
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

  const newUser = await User.create(filteredBody);
  newUser.password = undefined;

  // const emailUrl = `${req.protocol}://${req.get('host')}/${
  //   newUser.username
  // }/books/add`;
  // await new Email(newUser, emailUrl).sendWelcome();

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

exports.authenticate = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) return next(info.error);
    req.user = user;
    next();
  })(req, res, next);
};

exports.loginSuccess = (req, res, next) => {
  // Reached upon successful login.
  res.status(200).json({
    status: 'success',
    message: 'You were logged in successfully.',
    data: {
      user: req.user
    }
  });
};

exports.loginFailure = (req, res, next) => {
  return next(new AppError('User not found.', 404));
};

exports.protect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  next(new AppError('You are not logged in.', 401));
};
