const { v2: cloudinary } = require('cloudinary');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const generateArtifact = require('../utils/generateArtifact');
const Artifact = require('../models/Artifact');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createArtifact = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;

  const artifact = await generateArtifact(prompt);

  res.status(200).json({
    status: 'success',
    data: { artifact }
  });
});

exports.saveArtifactToCollection = catchAsync(async (req, res, next) => {
  const { prompt, artifact } = req.body;
  const { user } = req;

  const cloudArtifact = await cloudinary.uploader.upload(artifact, {
    folder: 'virtuavisage-generations'
  });

  const collectedArtifact = await Artifact.create({
    user,
    prompt,
    artifactUrl: cloudArtifact.url
  });

  res.status(201).json({
    success: true,
    data: {
      artifact: collectedArtifact
    }
  });
});

exports.getPublicArtifacts = catchAsync(async (req, res, next) => {
  res.status(200).json({
    message: 'To set up.'
  });
});

exports.makePublic = catchAsync(async (req, res, next) => {
  const { artifactId: id } = req.params;
  const { user } = req;

  const updatedArtifact = await Artifact.findOneAndUpdate(
    {
      _id: id,
      user
    },
    {
      isPublic: true
    },
    { new: true, runValidators: true }
  );

  if (!updatedArtifact) {
    return next(new AppError('Artifact not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      artifact: updatedArtifact
    }
  });
});

exports.removeFromPublic = catchAsync(async (req, res, next) => {
  const { artifactId: id } = req.params;
  const { user } = req;

  const updatedArtifact = await Artifact.findOneAndUpdate(
    {
      _id: id,
      user
    },
    {
      isPublic: false
    },
    { new: true, runValidators: true }
  );

  if (!updatedArtifact) {
    return next(new AppError('Artifact not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      artifact: updatedArtifact
    }
  });
});
