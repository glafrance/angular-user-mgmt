const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const constants = require("../constants/constants");
const multer = require("multer");
const utils = require("../utils/utils");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    if (
      req && 
      req.params && 
      utils.isNotNullOrUndefined(req.params.userId)
    ) {    
      const _id = req.params.userId;

      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, `${_id}.${filetype}`);  
    }  
  }
});

var upload = multer({storage: storage});

router.post(`/${constants.SIGNUP}`, userController.signupUser);
router.post(`/${constants.SIGNIN}`, userController.signinUser);

router.get(`/${constants.PROFILE}/:userId`, userController.getUserProfile);
router.post(`/${constants.PROFILE}/:userId`, userController.setUserProfile);

router.get(`/${constants.PROFILE_IMAGE}/:userId`, userController.getUserProfileImage);
router.post(`/${constants.PROFILE_IMAGE}/:userId`, upload.single("file"), userController.uploadUserProfileImage);

module.exports = router;