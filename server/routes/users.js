const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const constants = require("../constants/constants");

router.post(`/${constants.SIGNUP}`, userController.signupUser);
router.post(`/${constants.SIGNIN}`, userController.signinUser);

module.exports = router;