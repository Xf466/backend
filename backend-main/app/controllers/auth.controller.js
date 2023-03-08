const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
require('dotenv').config();
//Email Service
const emailService = require('./emailService.controller');

const Op = db.Sequelize.Op;
const timeoutPeriod = 48;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  // Generate a random number
	var randomNumber = Math.floor(Math.random() * 1000000000);

  User.create({
    user_id: randomNumber,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: bcrypt.hashSync(req.body.password, 8),
    linkedinid: req.body.linkedinid
  })
    .then(user => {
      var token = jwt.sign({ id: user.user_id }, config.secret, {
        expiresIn: process.env.TWO_DAYS_EXPIRY // two days token expiry
      });

      //It sends the email from here!
      var verificationUrl = process.env.BASE_URL + "/api/auth/verify/" + token;
      emailService.sendEmail(user.firstName, user.email, verificationUrl);
      
      res.status(201).send({});
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

exports.signin = (req, res) => {

  //Checks if the user is verified or not
  User.findOne({ where: { email: req.body.email }, raw: true })
    .then(data => {
      if (data) {
        if (data.verificationStatus == true) {
          User.findOne({
            where: {
              email: req.body.email
            }
          })
          .then(user => {
            if (!user) {
              return res.status(404).send();
            }
      
            var passwordIsValid = bcrypt.compareSync(
              req.body.password,
              user.password
            );
      
            if (!passwordIsValid) {
              return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
              });
            }
      
            var token = jwt.sign({ id: user.user_id }, config.secret, {
              expiresIn: process.env.EXPIRY // 2 years it won't expire
            });
      
            res.status(200).send({
              user_id: user.user_id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              linkedinid: user.linkedinid,
              accessToken: token
            });
          })
          .catch(err => {
            var badRequestSubstring = ["WHERE parameter", "Illegal arguments"];
            if (badRequestSubstring.some(str => err.message.includes(str))) {
              res.status(400).send({ message: err.message.split(",\n")});
            } else {
              res.status(500).send({ message: err.message.split(",\n")});
            }
          });
        } else {
          res.status(403).send({
            message: "You are not a verified user. Check your email inbox"
          });
        }
        
      } else {
        res.status(404).send({
          message: "User not found. Cannot sign in."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Fatal error happened"
      });
    });

};

//Update Verification Status
exports.verifyOTP = (req, res, next) => {
  //Grabs the user_id form the decoded token and the token provided
  const token = req.params.verificationToken;

  //The Token is decoded
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      const payload = jwt.verify(token, config.secret, {ignoreExpiration: true} );
      var newToken = jwt.sign({ id: payload.id }, config.secret);
      return res.status(401).render('emailverification', {
        message: "Verification link expired!", 
        newLink: `${process.env.BASE_URL}/api/auth/resend-verification-link/${newToken}`,
        status: "error"
      });
    } else {
      req.userId = decoded.id;
      User.update({
        verificationStatus: true
      }, {
          where: { [Op.and]: [{ user_id: req.userId }, { verificationStatus: false}]} //Has to satisfy all the conditions
        })
          .then(num => {
            if (num == 1) {
              res.status(200).render('emailverification', {
                message: "Verification successful!",
                newLink: null,
                status: "ok"
              });
            } else {
              res.status(200).render('emailverification', {
                message: "This account is already verified!",
                newLink: null,
                status: "warning"
              });
            }
          })
          .catch(err => {
            res.status(500).render('emailverification', {
              message: "Error cannot verify the user!",
              newLink: null,
              status: "error"
            });
          });
    }
    
  });
};


exports.sendVerificationCode = (req, res) => {
  const token = req.params.token;
  console.log(token);
  // //The Token is decoded
  jwt.verify(token, config.secret, (err, decoded) => {
    const user_id = decoded.id;
    // Check if user exists
    User.findOne({ where: { [Op.and]: [{ user_id: user_id }, { verificationStatus: false}]} })
    .then(user => {
      if (user) {
        // Generate new token
        var token = jwt.sign({ id: user_id }, config.secret, {
          expiresIn: process.env.TWO_DAYS_EXPIRY // two days token expiry
        });

        // Send email
        var verificationUrl = process.env.BASE_URL + "/api/auth/verify/" + token;
        emailService.sendEmail(user.firstName, user.email, verificationUrl);
        res.status(200).render('resendverification', {
          message: "A new email verification has been sent! Please check your inbox.",
          status: "ok"
        });
      } else {
        res.status(200).render('resendverification', {
          message: "User has already been verified, or user does not exist!",
          status: "warning"
        });
      }
    })
    .catch(err => {
      res.status(500).render('resendverification', {
        message: "Error cannot send new email verification!",
        status: "error"
      });
    })
  });
};