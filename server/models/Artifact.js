const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The artifact must belong to a user.']
    },
    prompt: {
      type: String,
      required: [
        true,
        'Please provide the prompt that was used to generate the image.'
      ],
      maxlength: [
        555,
        'The prompt should be the maximum length of 555 characters.'
      ],
      minlength: [5, 'The prompt should be the minimum length of 5 characters.']
    },
    artifactUrl: {
      type: String,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Artifact = mongoose.model('Artifact', artifactSchema);

module.exports = Artifact;
