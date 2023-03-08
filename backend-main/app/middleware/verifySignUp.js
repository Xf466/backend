const db = require("../models");
const User = db.user;

//Checking duplicate email
checkDuplicateEmail = (req, res, next) => {

  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Email is taken and already in use"
      });
      return;
    }

    next();
  });
};

validateFieldEntered = (req, res, next) => {
  var fieldsToCheck = ["firstName", "lastName", "password", "email"];
  var correspondingFieldName = ["First name", "Last name", "Password", "Email"];
  var invalidMessage = []
  for (let i = 0; i < fieldsToCheck.length; i++) {
    if (req.body[fieldsToCheck[i]] === undefined) {
      invalidMessage.push("'" + correspondingFieldName[i] + "' cannot be empty");
    }
  } 
  if (invalidMessage.length > 0) {
    res.status(400).send({
      message: invalidMessage
    });
    return;
  } 
  next();
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  validateFieldEntered: validateFieldEntered
};

module.exports = verifySignUp;