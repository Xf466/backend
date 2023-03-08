const controller = require("../controllers/payment.controller");
const { authJwt } = require("../middleware");
module.exports = function(app) {
    app.use(function(_req, res, next) {
        next();
    });

    app.post(
        "/api/payment",
        [authJwt.verifyToken],
        controller.create
    );
};
