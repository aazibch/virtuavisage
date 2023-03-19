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

exports.login = (req, res, next) => {
  return next(new AppError('Something is wrong', 500));
  // Reached upon successful login.
  res.status(200).json({
    status: 'success',
    message: 'You were logged in successfully.',
    data: {
      user: req.user
    }
  });
};
