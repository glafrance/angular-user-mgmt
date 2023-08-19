const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
const uuid = require("uuid");

exports.isNotNullOrUndefined = (value) => {
  const result = (value !== null && value !== undefined);
  return result;
};

exports.isNotNullOrUndefinedOrEmpty = (value) => {
  const result = (value !== null && value !== undefined && value !== "");

  if (result && Array.isArray(value)) {
    result = value.length;
  }

  return result;
};

exports.createJWT = (userId) => {
  const RSA_PRIVATE_KEY = fs.readFileSync('../user_management.key');

  const jwtBearerToken = jsonwebtoken.sign({}, RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: 60,
    subject: userId
  });

  return jwtBearerToken;
};

exports.generateSessionId = () => {
  const generatedUuid = uuid.v4(); 

  return generatedUuid;
}