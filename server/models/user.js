const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  postalCode: String,
  homePhone: String,
  mobilePhone: String,
  workPhone: String,
  bioBlurb: String,
  profileImageUrl: String 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
