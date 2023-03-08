const db = require("../models");
const Application = db.application;

validateFile = (req, res, next) => {
  // Only accept those files types
  var validFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
  var invalidMessage = []
  if (!req.files.proof_file) {
    invalidMessage.push( "File cannot be empty");
  } else {
    if (!validFileTypes.some(str => req.files.proof_file.type.includes(str))) {
      invalidMessage.push( "File is in wrong format. Accepted format: pdf, word, png, jpeg");
    }
  }
  // Check if application id is not a number
  if (isNaN(req.body.application_id)) {
    invalidMessage.push( "Application ID is not a number");
  } 
  if (invalidMessage.length > 0) {
    res.status(400).send({
      message: invalidMessage
    });
    return;
  } 
  next();
};

const verifyProof = {
    validateFile: validateFile
};

module.exports = verifyProof;