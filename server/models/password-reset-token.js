const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
  _userEmail: { type: String, required: true, ref: 'User' },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model('PasswordResetToken', ResetTokenSchema);