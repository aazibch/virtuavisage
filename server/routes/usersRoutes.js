const passport = require('passport');
const express = require('express');
const router = express.Router();
const { clientUrl } = require('../constants/index');

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersControlller');

router.route('/auth/signup').post(authController.signup);
router.route('/auth/login').post(authController.authenticateLocal);
router.route('/auth/logout').get(authController.protect, authController.logout);

router.route('/auth/google').get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    display: 'popup'
  })
);

router
  .route('/auth/google/callback')
  .get(
    passport.authenticate('google', {
      successRedirect: `${clientUrl}/auth/google/success`
    })
  );

router.route('/me').get(usersController.getMe);

module.exports = router;
