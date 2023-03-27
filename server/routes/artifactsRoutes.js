const express = require('express');
const router = express.Router();

const artifactsController = require('../controllers/artifactsController');
const authController = require('../controllers/authController');

router
  .route('/')
  .post(authController.protect, artifactsController.createArtifact);

router
  .route('/collection')
  .post(authController.protect, artifactsController.saveArtifactToCollection);

router
  .route('/collection/:artifactId')
  .delete(
    authController.protect,
    artifactsController.removeArtifactFromCollection
  );

router
  .route('/public')
  .get(artifactsController.getPublicArtifacts)
  .post(authController.protect, artifactsController.makePublic);

router
  .route('/public/:artifactId')
  .delete(authController.protect, artifactsController.removeFromPublic);

module.exports = router;
