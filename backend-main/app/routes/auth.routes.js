const { verifySignUp, verifyEmailPassword } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {

  // Sign up a user endpoint & handle validation checks
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.validateFieldEntered,
      verifyEmailPassword.validateEmailPassword,
      verifySignUp.checkDuplicateEmail
    ],
    controller.signup
  );

  // Sign in a user endpoint & handle validation checks
  app.post("/api/auth/signin",
    [
      verifyEmailPassword.validateEmailPassword
    ],
    controller.signin
  );

  // Verify sent email url & the token
  app.get("/api/auth/verify/:verificationToken",
   controller.verifyOTP
  );

  // Resend the verification link
  app.get("/api/auth/resend-verification-link/:token",
   controller.sendVerificationCode
  );

};