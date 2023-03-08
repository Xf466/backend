const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyReferral = require("./verifyReferral");
const verifyEmailPassword = require("./verifyEmailPassword");
const verifyApplication = require("./verifyApplication");
const verifyRating = require("./verifyRating");
const verifyProof = require("./verifyProof");

module.exports = {
  authJwt,
  verifySignUp,
  verifyReferral,
  verifyEmailPassword,
  verifyApplication,
  verifyRating,
  verifyProof
};