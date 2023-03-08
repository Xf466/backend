const controller = require("../controllers/rating.controller");
const { authJwt, verifyRating } = require("../middleware");


module.exports = function(app) {
  
    // Create a rating
    app.post(
        "/api/rating/create",
        [authJwt.verifyToken, verifyRating.validateFieldEntered],
        controller.create
    );
    
    // Get ratings of a user by user_id
    app.get(
        "/api/ratings/:user_id",
        [authJwt.verifyToken],
        controller.getAllByUserId
    );

    // Get a ratings made by current logged in user
    app.get(
        "/api/ratings/me",
        [authJwt.verifyToken],
        controller.getAllRatingByCurrentUser
    );

};