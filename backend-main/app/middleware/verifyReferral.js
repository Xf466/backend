const db = require("../models");

validateFieldEntered = (req, res, next) => {
  var fieldsToCheck = ["job_title", "price"];
  var correspondingFieldName = ["Job Title", "Price"];
  var invalidMessage = []
  for (let i = 0; i < fieldsToCheck.length; i++) {
    if (req.body[fieldsToCheck[i]] === undefined) {
      invalidMessage.push( "'" + correspondingFieldName[i] + "' cannot be empty");
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

const verifyReferral = {
  validateFieldEntered: validateFieldEntered
};

module.exports = verifyReferral;