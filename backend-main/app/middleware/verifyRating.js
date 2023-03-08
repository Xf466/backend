const db = require("../models");
const Application = db.application;

validateFieldEntered = (req, res, next) => {
/*
The code below will check if the value
entered is valid
*/
  var invalidMessage = []
  if (isNaN(req.body.referral_id)) {
    invalidMessage.push( "Referral ID is not a number");
  } 
  if (isNaN(req.body.application_id)) {
    invalidMessage.push( "Application ID is not a number");
  } 
  if (!req.body.rating_score) {
    invalidMessage.push( "Rating score cannot be empty");
  }
  Application.findOne({ where: { application_id: req.body.application_id } }) 
  .then(application => {
    // Check if application exists
    if (application) {
      // Check if the application status is "rating" to proceed
      if (application.dataValues.application_status !== "rating") {
        invalidMessage.push( "Can only rate an application if the status is 'awaiting rating'");
        res.status(400).send({
          message: invalidMessage
        });
        return;
      }
    } else {
      invalidMessage.push( "Application ID does not exist");
      res.status(400).send({
        message: invalidMessage
      });
      return;
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Fatal error happened"
    });
  });

  if (invalidMessage.length > 0) {
    res.status(400).send({
      message: invalidMessage
    });
    return;
  } 

  next();
};

const verifyRating = {
  validateFieldEntered: validateFieldEntered
};

module.exports = verifyRating;