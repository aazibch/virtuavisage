const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersControlller');

router.route('/auth/signup').post(authController.signup);
router.route('/auth/login').post(authController.authenticateLocal);

router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/auth/google/callback').get(authController.authenticateGoogle);

router.route('/me').get(authController.protect, usersController.getMe);

module.exports = router;
