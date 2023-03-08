const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;

// Get a user by email of user id
exports.findByEmailOrId = (req, res) => {

  const input = req.params.emailid;
  var condition = {};
  if (isNaN(input)) {
    condition = {
      email: input
    }
  } else {
    condition = {
      user_id: input
    }
  }
  User.findOne({ where: condition })
    .then(data => {
      delete data.dataValues.password; // Remove password field
      if (data) {
        res.send({ 
          ...data.dataValues
        });
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

// Update Profile
exports.updateProfile = (req, res) => {
  const user_id = req.userId;

  if (isNaN(user_id)) {
    return res.status(400).send({
        message: "User ID must be a number"
    });
  }
  
  if (req.body.password) {
    // delete req.body.password; 
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  User.update(req.body, {
      where: { user_id: user_id }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send();
        } else {
          res.status(404).send();
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Profile with id=" + user_id
        });
      });
};