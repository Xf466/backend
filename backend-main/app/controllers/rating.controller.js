const db = require("../models");
const Application = db.application;
const Referral = db.referral;
const Op = db.Sequelize.Op;
const User = db.user;
const Rating = db.rating;

// Create a rating to database
exports.create = (req, res) => {
    Rating.create({
        referral_id: req.body.referral_id,
        application_id: req.body.application_id,
        user_id: req.userId,
        rating_score: req.body.rating_score,
        rating_feedback: req.body.rating_feedback

    })
    .then(user => {
        // Update Application status to "done"
        Application.update({application_status: "done"}, {
            where: { application_id: req.body.application_id }
        })
        .then(num => {
            res.status(201).send({});
        })
        .catch(err => {
            res.status(500).send();
        });
    })
    .catch(err => {
        var badRequestSubstring = ["notNull Violation"];
        if (badRequestSubstring.some(str => err.message.includes(str))) {
            res.status(400).send({ message: err.message.split(",\n")});
        } else {
            res.status(500).send({ message: err.message.split(",\n")});
        }
    });
};




exports.getAllRatingByCurrentUser = (req, res) => {
    Rating.findAll({ raw : true, where: { user_id: req.userId } })
    .then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send();
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Fatal error happened"
        });
    });
  };

exports.getAllByUserId = (req,res,next) => {
    const user_id = req.params.user_id;

    if (user_id === "me"){
        return next();
    }

    if (isNaN(user_id)) {
        return res.status(400).send({
            message: "User ID must be a number"
        });
    }
    Rating.findAll({ raw : true, where: { user_id: user_id } })
    .then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send();
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Fatal error happened"
        });
    });
};