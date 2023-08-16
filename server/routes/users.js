const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const constants = require("../constants/constants");
const multer = require("multer");

router.post(`/${constants.SIGNUP}`, userController.signupUser);
router.post(`/${constants.SIGNIN}`, userController.signinUser);

router.get(`/${constants.PROFILE}/:userId`, userController.getUserProfile);
router.post(`/${constants.PROFILE}/:userId`, userController.setUserProfile);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("middleware one", file);
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    console.log("middleware two", file);
    var filetype = '';
    if(file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if(file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
    console.log("middleware three", file);
  }
});

var upload = multer({storage: storage});

router.post(`/${constants.PROFILE_IMAGE}/:userId`, upload.single("file"), userController.uploadUserProfileImage);

module.exports = router;