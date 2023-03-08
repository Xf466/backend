const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // Get user by a user by email or user_id
  app.get("/api/get/user/:emailid", 
  [
    authJwt.verifyToken
  ], 
  controller.findByEmailOrId);

  //Update User Profile
  app.put("/api/user/update/", 
  [
    authJwt.verifyToken
  ],
  controller.updateProfile);
};