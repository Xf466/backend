const controller = require("../controllers/application.controller");
const { authJwt, verifyApplication, verifyProof } = require("../middleware");

module.exports = function(app) {

    // Create an application (order)
    app.post(
        "/api/application",
        [authJwt.verifyToken, verifyApplication.validateFieldEntered],
        controller.create
    );

    // Get an application by their application id
    app.get(
        "/api/application/:id",
        [authJwt.verifyToken],
        controller.get
    );

    // Get applications of the current logged in user
    app.get(
        "/api/applications/me",
        [authJwt.verifyToken],
        controller.getAllByCurrentUser
    );

    // Get the uploaded application CV by application id
    app.get(
        "/api/application/cv/:id",
        [authJwt.verifyToken],
        controller.getApplicationFile
    );

    app.delete(
        "/api/application/:id", 
        [authJwt.verifyToken], 
        controller.delete
    );

    // Either accept or decline a referral by their application id
    app.put(
        "/api/application/:status/:id", 
        [authJwt.verifyToken], 
        controller.acceptOrDecline
    );

    // Cancel a referral by their application id
    app.put(
        "/api/application/cancel/:id", 
        [authJwt.verifyToken], 
        controller.cancel
    );

    // Get a referral by a referral id
    app.get(
        "/api/applications/:referral_id", 
        [authJwt.verifyToken], 
        controller.getAllByReferral
    );

    // Job seeker upload application proof endpoint
    app.put(
        "/api/application/uploadproof",
        [authJwt.verifyToken, verifyProof.validateFile],
        controller.uploadProof
    );

    // Get the uploaded proof file by the application id
    app.get(
        "/api/application/proof/:id",
        [authJwt.verifyToken],
        controller.getProofFile
    );
};