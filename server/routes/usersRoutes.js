const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersControlller');

router.route('/signup').post(authController.signup);
router
  .route('/login')
  .post(passport.authenticate('local'), authController.login);

router.route('/me').get(authController.protect, usersController.getMe);

module.exports = router;
