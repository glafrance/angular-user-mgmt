const bcrypt = require("bcrypt");
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

UserSchema.statics.EncryptPassword = async (password) => {  
  const hash = await bcrypt.hash(password, 12);  
  return hash;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
