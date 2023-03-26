const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersControlller');

router.route('/signup').post(authController.signup);
router.route('/login').post((req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/api/v1/users/login/failure',
    successRedirect: '/api/v1/users/login/success'
  })(req, res, next);
});

router.route('/login/failure').get(authController.loginFailure);
router.route('/login/success').get(authController.loginSuccess);
router.route('/me').get(authController.protect, usersController.getMe);

module.exports = router;
