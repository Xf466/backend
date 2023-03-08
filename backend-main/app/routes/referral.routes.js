const controller = require("../controllers/referral.controller");
const { authJwt, verifyReferral } = require("../middleware");
module.exports = function(app) {

    // Create a referral
    app.post(
        "/api/referral/create",
        [authJwt.verifyToken, verifyReferral.validateFieldEntered],
        controller.create
    );

    // Get a referral by its ID
    app.get(
        "/api/get/referral/:id",
        [authJwt.verifyToken],
        controller.get
    );

    // Get all referrals
    app.get(
        "/api/get/referrals/",
        [authJwt.verifyToken],
        controller.getAll
    );

    // Get referral of this current user, excluding referrals made by myself
    app.get(
        "/api/get/referrals/me",
        [authJwt.verifyToken],
        controller.getAllByCurrentUser
    );

    // Update a referral by their id
    app.put(
        "/api/referral/update/:id",
        [authJwt.verifyToken],
        controller.update
    );

    // Delete a referral by its referral id
    app.delete(
        "/api/referral/delete/:id",
        [authJwt.verifyToken],
        controller.delete
    );

    // Search a referral by 'job_title', 'location' and/or 'company' in ascending/descending price order
    app.get(
        "/api/search/referral/",
        [authJwt.verifyToken],
        controller.searchQuery
    );
    
};