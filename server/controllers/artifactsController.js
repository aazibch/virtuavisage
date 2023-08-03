const { v2: cloudinary } = require('cloudinary');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const generateArtifact = require('../utils/generateArtifact');
const Artifact = require('../models/Artifact');
const User = require('../models/User');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createArtifact = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;

  const artifact = await generateArtifact(prompt);

  if (artifact) {
    await User.findByIdAndUpdate(req.user, {
      $inc: { artifactsGenerated: 1 }
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      prompt,
      artifact
    }
  });
});

exports.getCollectedArtifacts = catchAsync(async (req, res, next) => {
  const artifacts = await Artifact.find({
    user: req.user
  })
    .populate('user')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: {
      artifacts
    }
  });
});

exports.saveArtifactToCollection = catchAsync(async (req, res, next) => {
  const { prompt, artifact } = req.body;
  const { user } = req;

  const cloudArtifact = await cloudinary.uploader.upload(artifact, {
    folder: 'virtuavisage-generations'
  });

  let collectedArtifact = await Artifact.create({
    user,
    prompt,
    artifactUrl: cloudArtifact.url.replace('http', 'https')
  });

  const userDoc = await User.findById(user);

  collectedArtifact.user = userDoc;

  res.status(201).json({
    success: true,
    data: {
      artifact: collectedArtifact
    }
  });
});

exports.removeArtifactFromCollection = catchAsync(async (req, res, next) => {
  const {
    params: { artifactId: id },
    user
  } = req;

  const artifact = await Artifact.findOneAndDelete({ _id: id, user });

  if (!artifact) return next(new AppError('Artifact not found.', 404));

  const artifactUrl = artifact.artifactUrl.split('/');
  const cloudId = artifactUrl[artifactUrl.length - 1].split('.')[0];

  await cloudinary.uploader.destroy(`virtuavisage-generations/${cloudId}`);

  res.status(204).json({
    status: 'success',
    data: {
      artifact
    }
  });
});

exports.getPublicArtifacts = catchAsync(async (req, res, next) => {
  const artifacts = await Artifact.find({
    isPublic: true
  })
    .populate('user')
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    data: {
      artifacts
    }
  });
});

exports.makePublic = catchAsync(async (req, res, next) => {
  const { id } = req.body;
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
  ).populate('user');

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
