const passport = require('passport');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.route('/signup').post(authController.signup);
router
  .route('/login')
  .post(passport.authenticate('local'), authController.login);

module.exports = router;
