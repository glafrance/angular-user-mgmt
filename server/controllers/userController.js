const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const config = require("../config");
const constants = require("../constants/constants");
const PasswordResetToken = require("../models/password-reset-token");
const User = require("../models/user");
const utils = require("../utils/utils");

exports.signupUser = (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.email) &&
    utils.isNotNullOrUndefined(req.body.password)
  ) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then((user) => {
        if (user) {
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_EXISTS_ERROR 
          });
        } else {
          return bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(401).json({ message: 'Error hashing password' });
            }
            const body = {
              email,
              password: hash
            };

            User.create(body)
              .then(user => {
                res.status(200).json({ result: constants.SUCCESS });
              })
              .catch((err) => {
                console.log("Error signing up user - one", err);
                res.status(401).json({ 
                  result: constants.FAILURE,
                  error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
                });
              });
          });
        }
      })
      .catch((err) => {
        console.log("Error signing up user - two", err);
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
        });
      });
  } else {
    console.log("Error signing up user - three");
    res.status(500).json({ 
      result: constants.FAILURE,
      error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
    });
  }
};

exports.signinUser = (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.email) &&
    utils.isNotNullOrUndefined(req.body.password)
  ) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then((user) => {
        if (user) {
          const hashStoredInDB = user.password;

          bcrypt.compare(password, hashStoredInDB).then((checkPasswordResult) => {
            if (checkPasswordResult) {
              const jwt = utils.createJWT(user._id.toString());
              const sessionId = utils.generateSessionId();

              res.cookie(sessionId, jwt, { httpOnly: true, secure: true });

              return res.status(200).json({ 
                userId: user._id,
                result: constants.SUCCESS
              });    
            } else {
              console.log("Error signing in user - one");
              return res.status(401).json({ 
                result: constants.FAILURE,
                error: constants.SIGNIN_FAILURE 
              });
            }
          });
        } else {
          console.log("Error signing in user - two");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.SIGNIN_FAILURE 
          });
        }
      })
      .catch((err) => {
        console.log("Error signing in user - three", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.SIGNIN_FAILURE 
        });
      });
  } else {
    console.log("Error signing in user - four");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.SIGNIN_FAILURE 
    });
  }
};

exports.getUserProfile = (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          let userData = {...user._doc};
          delete userData.password;
          delete userData.__v;
          delete userData._id;

          return res.status(200).json({ 
            result: constants.SUCCESS,
            data: userData
          });
        } else {
          console.log("Error getting user profile - one");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_FOUND 
          });
        }
      })
      .catch((err) => {
        console.log("Error getting user profile - two", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_FOUND}` 
        });
      });
  } else {
    console.log("Error getting user profile - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_COULD_NOT_BE_FOUND 
    });
  }
};

exports.setUserProfile = async (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId) &&
    req.body &&
    req.body.data
  ) {    
    const _id = req.params.userId;
    const data = req.body.data;

    const updatedDoc = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id) }, 
      data, 
      {
        new: true
      }
    );

    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          let userData = {...user._doc};
          delete userData.password;
          delete userData.__v;
          delete userData._id;

          return res.status(200).json({ 
            result: constants.SUCCESS,
            data: userData
          });
        } else {
          console.log("Error setting user profile - one");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
          });
        }
      })
      .catch((err) => {
        console.log("Error setting user profile - two", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR}` 
        });
      });
  } else {
    console.log("Error setting user profile - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
    });
  }
};

exports.getUserProfileImage = (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .then((user) => {
        if (user) {
          let userData = {...user._doc};

          if (userData && utils.isNotNullOrUndefined(userData.profileImageUrl)) {
            return res.status(200).json({ 
              result: constants.SUCCESS,
              data: userData.profileImageUrl
            });  
          } else {
            console.log("Error getting user profile image - one");
            return res.status(401).json({ 
              result: constants.FAILURE,
              error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
            });  
          }
        } else {
          console.log("Error getting user profile image - two");
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
          });
        }
      })
      .catch((err) => {
        console.log("Error getting user profile image - three", err);
        res.status(401).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR}` 
        });
      });
  } else {
    console.log("Error getting user profile image - four");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
    });
  }
};

exports.uploadUserProfileImage = async (req, res) => {
  if (
    req && 
    req.params && 
    utils.isNotNullOrUndefined(req.params.userId)
  ) {    
    const _id = req.params.userId;

    if(!req.file) {
      console.log("Error uploading user profile image - one");
      return res.status(401).json({ 
        result: constants.FAILURE,
        error: constants.USER_PROFILE_COULD_NOT_BE_UPLOADED_ERROR 
      });
    } else {
      const userProfileImageUrl = `http://localhost:4002/images/${req.file.filename}`;

      await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) }, 
        {
          profileImageUrl: userProfileImageUrl
        }, 
        {
          new: true
        }
      );
  
      User.findOne({ _id: new mongoose.Types.ObjectId(_id) })
        .then((user) => {
          if (user) {
            let userData = {...user._doc};

            if (userData.profileImageUrl === userProfileImageUrl) {
              return res.status(200).json({ 
                result: constants.SUCCESS,
                userProfileImageUrl
              });        
            } else {
              console.log("Error uploading user profile image - two");
              return res.status(401).json({ 
                result: constants.FAILURE,
                error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
              });              
            }
          } else {
            console.log("Error uploading user profile image - three");
            return res.status(401).json({ 
              result: constants.FAILURE,
              error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
            });
          }
        })
        .catch((err) => {
          console.log("Error uploading user profile image - four", err);
          res.status(401).json({ 
            result: constants.FAILURE,
            error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR}` 
          });
        });;
    }    
  } else {
    console.log("Error uploading user profile image - five");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
    });
  }
};

exports.resetPassword = async (req, res) => {
  if (
    req && 
    req.body &&
    utils.isNotNullOrUndefined(req.body.email)
  ) {    
    const email = req.body.email;
    const user = await User.findOne({ email })

    if (!user) {
      console.log("Error creating reset password email and link - one");
      return res.status(401).json({ 
        result: constants.FAILURE,
        error: constants.RESET_PASSWORD_FAILED 
      });
    }

    PasswordResetToken.deleteMany({ _userEmail: user.email})
      .then(() => {
        PasswordResetToken.create({ _userEmail: user.email, resetToken: crypto.randomBytes(16).toString('hex') })
        .then(resetToken => {          
          res.status(200).json({ 
            result: constants.SUCCESS
          });  
  
          // user here is the email address that will send the reset password email with link
          // if gmail, pass should be the app password setup in the google account
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            auth: {
              user: config.SENDER_EMAIL_ADDRESS,
              pass: config.SENDER_APP_PASSWORD
            }
          });
  
  
          // "from" here is the email address that will send the reset password email with link
          const mailOptions = {
            to: user.email,
            from: config.SENDER_EMAIL_ADDRESS,
            subject: 'User Manager Password Reset',
            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:4200/response-reset-password/' + resetToken.resetToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          }
  
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log("sendMail err", err);
            }
            if (info) {
              // console.log("sendMail info", info);
            }
          });
        })
        .catch((err) => {
          console.log("Error creating reset password email and link - two", err);
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: err.message 
          });
        });        
      })
      .catch((err) => {
        console.log("Error creating reset password email and link - three", err);
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });  
      });
  } else {
    console.log("Error creating reset password email and link - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.EMAIL_IS_REQUIRED 
    });
  }
};

exports.validatePasswordToken = async (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.resetToken)
  ) {
      const token = await PasswordResetToken.findOne({
        resetToken: req.body.resetToken
      });

      if (!token) {
        console.log("Error validating reset password token - one");
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });
      }

      User.findOne({ _id: token._userId })
        .then(() => {
          return res.status(200).json({ 
            result: constants.SUCCESS
          });        
        }).catch((err) => {
          console.log("Error validating reset password token - two", err);
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });
        });
  } else {
    console.log("Error validating reset password token - three");
    return res.status(401).json({ 
      result: constants.FAILURE,
      error: constants.TOKEN_IS_REQUIRED 
    });
  }
};

exports.newPassword = async (req, res) => {
  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.resetToken) &&
    utils.isNotNullOrUndefined(req.body.newPassword)
  ) {
    const resetToken = req.body.resetToken;
    const newPassword = req.body.newPassword;

    PasswordResetToken.findOne({ 
      resetToken 
    }).then((userToken) => {
      if (userToken) {
        User.findOne({
          email: userToken._userEmail
        }).then((user) => {
          if (user) {
            return bcrypt.hash(newPassword, 10, (err, hash) => {
              if (err) {
                console.log("Error resetting password - one", err);
                return res.status(401).json({ 
                  result: constants.FAILURE,
                  error: constants.RESET_PASSWORD_FAILED 
                });    
              }
              user.password = hash;
              user.save().then((docs) => {
                PasswordResetToken.deleteOne({_userEmail: userToken._userEmail})
                  .then((docs) => {
                    console.log("token deleted", docs);
                  })
                  .catch((err) => {
                    console.log("error deleting token", err);
                  });
  
                return res.status(200).json({ 
                  result: constants.SUCCESS
                });        
              })
              .catch((err) => {
                console.log("Error resetting password - two", err);
                return res.status(401).json({ 
                  result: constants.FAILURE,
                  error: constants.RESET_PASSWORD_FAILED 
                });      
              });
            });              
          } else {
            return res.status(401).json({ 
              result: constants.FAILURE,
              error: constants.RESET_PASSWORD_FAILED 
            });    
          }
        })
        .catch((err) => {
          console.log("Error resetting password - three", err);
          return res.status(401).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });  
        });
      } else {
        console.log("Error resetting password - four");
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });  
      }   
      })
      .catch((err) => {
        console.log("Error resetting password - five", err);
        return res.status(401).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });      
      });
  }
};
