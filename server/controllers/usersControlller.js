const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');

exports.getMe = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user);

  if (!user)
    return res.status(200).json({
      status: 'success',
      data: {
        user: null
      }
    });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
