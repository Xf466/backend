const db = require("../models");
const User = db.user;

//Validate Email and Password
validateEmailPassword = (req, res, next) => {
    var emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    var passwordRegex = new RegExp('(?=.{8,})');
    var isEmail = emailRegex.test(req.body.email);
    var isPassword = passwordRegex.test(req.body.password);
    if (!isEmail || !isPassword) {
        var message = []
        if (!isEmail) {
            message.push("Invalid email.");
        }
        if (!isPassword) {
            message.push("Password entered must be at least 8 characters long.");
        }
        res.status(400).send({
            message: message
        });
        return;
    }
    next();
};

const verifyEmailPassword = {
    validateEmailPassword: validateEmailPassword
};

module.exports = verifyEmailPassword;