const constants = require("../constants/constants");
const User = require("../models/user");
const utils = require("../utils/utils");

exports.signupUser = (req, res) => {
  console.log("signupUser", req.body);

  if (
    utils.isNotNullOrUndefined(req) &&
    utils.isNotNullOrUndefined(req.body) &&
    utils.isNotNullOrUndefined(req.body.email) &&
    utils.isNotNullOrUndefined(req.body.password)
  ) {
    const email = req.body.email;
    const password = req.body.email;

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
        }
      });
  }
};
