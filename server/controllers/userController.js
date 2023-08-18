const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

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
          return res.status(400).json({ 
            result: constants.FAILURE,
            error: constants.USER_EXISTS_ERROR 
          });
        } else {
          return bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(400).json({ message: 'Error hashing password' });
            }
            const body = {
              email,
              password: hash
            };

            User.create(body)
              .then(user => {
                res.status(200).json({ result: constants.SUCCESS });
              })
              .catch(() => {
                res.status(500).json({ 
                  result: constants.FAILURE,
                  error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
                });
              });
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
        });
      });
  } else {
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
              return res.status(200).json({ 
                userId: user._id,
                result: constants.SUCCESS
              });    
            } else {
              return res.status(501).json({ 
                result: constants.FAILURE,
                error: constants.SIGNIN_FAILURE 
              });
            }
          });
        } else {
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.SIGNIN_FAILURE 
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.SIGNIN_FAILURE}` 
        });
      });
  } else {
    return res.status(501).json({ 
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
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_FOUND 
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_FOUND}` 
        });
      });
  } else {
    return res.status(501).json({ 
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
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR}` 
        });
      });
  } else {
    return res.status(501).json({ 
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
            return res.status(501).json({ 
              result: constants.FAILURE,
              error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
            });  
          }
        } else {
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR 
          });
        }
      })
      .catch(() => {
        res.status(500).json({ 
          result: constants.FAILURE,
          error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_RETRIEVED_ERROR}` 
        });
      });
  } else {
    return res.status(501).json({ 
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
      return res.status(500).json({ 
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
              return res.status(501).json({ 
                result: constants.FAILURE,
                error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
              });              
            }
          } else {
            return res.status(501).json({ 
              result: constants.FAILURE,
              error: constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR 
            });
          }
        })
        .catch(() => {
          res.status(500).json({ 
            result: constants.FAILURE,
            error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_PROFILE_IMAGE_COULD_NOT_BE_UPLOADED_ERROR}` 
          });
        });;
    }    
  } else {
    return res.status(501).json({ 
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
      return res.status(501).json({ 
        result: constants.FAILURE,
        error: constants.RESET_PASSWORD_FAILED 
      });
    }

    PasswordResetToken.create({ _userEmail: user.email, resetToken: crypto.randomBytes(16).toString('hex') })
      .then(resetToken => {
        const token = PasswordResetToken.find(
          { 
            _userEmail: user.email, 
            resetToken: { 
              $ne: resetToken.resetToken 
            } 
          }
        );

        if (token) {
          PasswordResetToken.deleteOne({_userEmail: token._userEmail, resetToken: token.resetToken});
        }
        
        res.status(200).json({ 
          result: constants.SUCCESS
        });  

        // user here is the email address that will send the reset password email with link
        // if gmail, pass should be the app password setup in the google account
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          port: 465,
          auth: {
            user: 'SENDERS_EMAIL_ADDRESS',
            pass: 'SENDERS_GOOGLE_APP_PASSWORD'
          }
        });


        // "from" here is the email address that will send the reset password email with link
        const mailOptions = {
          to: user.email,
          from: 'SENDERS_EMAIL_ADDRESS',
          subject: 'User Manager Password Reset',
          text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200/response-reset-password/' + resetToken.resetToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log("err", err);
          }
          if (info) {
            console.log("info", info);
          }
        });
      })
      .catch((err) => {
        return res.status(501).json({ 
          result: constants.FAILURE,
          error: err.message 
        });
      });
  } else {
    return res.status(501).json({ 
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
        return res.status(501).json({ 
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
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });
        });
  } else {
    return res.status(501).json({ 
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
                return res.status(501).json({ 
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
              .catch(() => {
                return res.status(501).json({ 
                  result: constants.FAILURE,
                  error: constants.RESET_PASSWORD_FAILED 
                });      
              });
            });              
          } else {
            return res.status(501).json({ 
              result: constants.FAILURE,
              error: constants.RESET_PASSWORD_FAILED 
            });    
          }
        })
        .catch(() => {
          return res.status(501).json({ 
            result: constants.FAILURE,
            error: constants.RESET_PASSWORD_FAILED 
          });  
        });
      } else {
        return res.status(501).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });  
      }   
      })
      .catch(() => {
        return res.status(501).json({ 
          result: constants.FAILURE,
          error: constants.RESET_PASSWORD_FAILED 
        });      
      });
  }
};
