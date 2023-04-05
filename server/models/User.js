const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name.'],
      maxlength: [
        50,
        'The name should be the maxiumum length of 50 characters.'
      ],
      minlength: [3, 'The name should be the minimum length of 3 characters.'],
      validate: {
        validator: function (val) {
          return /^[a-zA-Z ]*$/.test(val);
        },
        message:
          'The name can only contain alphabetical characters (letters A-Z).'
      }
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      validate: [validator.isEmail, 'Please provide a valid email address.'],
      unique: [true, 'The email address already exists.'],
      lowercase: true,
      maxlength: [
        50,
        'The email address should be the maxiumum length of 50 characters.'
      ],
      minlength: [
        5,
        'The email address should be the minimum length of 5 characters.'
      ]
    },
    artifactsGenerated: {
      type: Number,
      default: 0
    },
    password: {
      type: String,
      minlength: [
        8,
        'The password should be a minimum length of 8 characters.'
      ],
      select: false
    },
    passwordConfirmation: {
      type: String,
      required: [
        function () {
          return this.password;
        },
        'Please confirm your password.'
      ],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match.'
      }
    },
    passwordChangeDate: Date,
    passwordResetToken: String,
    passwordResetTokenExpirationDate: Date,
    authType: {
      type: mongoose.Schema.Types.String,
      enum: ['google', 'local'],
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeDate = Date.now() - 1000;
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  inputPass,
  encryptedPass
) {
  return await bcrypt.compare(inputPass, encryptedPass);
};

userSchema.methods.changedPasswordAfterToken = function (
  tokenIssuanceTimestamp
) {
  if (this.passwordChangeDate) {
    const passwordChangeTimestamp = this.passwordChangeDate.getTime() / 1000;

    return tokenIssuanceTimestamp < passwordChangeTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Reset token expires in five minutes.
  this.passwordResetTokenExpirationDate = Date.now() + 5 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
