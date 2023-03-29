const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersControlller');

router.route('/signup').post(authController.signup);
router
  .route('/login')
  .post(authController.authenticateLocal, authController.loginSuccess);

router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
  .route('/auth/google/callback')
  .get(authController.authenticateGoogle, authController.loginSuccess);

router.route('/login/failure').get(authController.loginFailure);
router.route('/login/success').get(authController.loginSuccess);
router.route('/me').get(authController.protect, usersController.getMe);

module.exports = router;
