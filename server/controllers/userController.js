const mongoose = require("mongoose");

const constants = require("../constants/constants");
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
          const newUser = new User({ email, password });
          newUser.save();

          setTimeout(() => {
            User.findOne({ email })
            .then((user) => {
              if (user) {
                return res.status(200).json({ 
                  result: constants.SUCCESS
                });
              } else {
                return res.status(500).json({ 
                  result: constants.FAILURE,
                  error: `${constants.INTERNAL_SERVER_ERROR}: ${constants.USER_COULD_NOT_BE_CREATED_ERROR}` 
                });
              }
            });      
          }, 500);
        }
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

    User.findOne({ email, password })
      .then((user) => {
        if (user) {
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
            error: constants.USER_PROFILE_COULD_NOT_BE_SAVED_ERROR 
          });
        }
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
        });
    }    
  }
};
