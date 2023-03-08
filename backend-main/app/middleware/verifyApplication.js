const db = require("../models");

validateFieldEntered = (req, res, next) => {
  var fieldsToCheck = ["referral_id", "application_status"];
  var correspondingFieldName = ["Referral ID", "Application Status"];
  var validFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
  var invalidMessage = []
  if (!req.files.cv_file) {
    invalidMessage.push( "File cannot be empty");
  } else {
    // console.log(req.files.cv_file.type);
    if (!validFileTypes.some(str => req.files.cv_file.type.includes(str))) {
      invalidMessage.push( "File is in wrong format. Accepted format: pdf, word, png, jpeg");
    }
  }
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

const verifyApplication = {
  validateFieldEntered: validateFieldEntered
};

module.exports = verifyApplication;