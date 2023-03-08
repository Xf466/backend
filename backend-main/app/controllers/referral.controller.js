const db = require("../models");
const config = require("../config/auth.config");
const { query } = require("express");
const { referral } = require("../models");
const Referral = db.referral;
const User = db.user;
const Rating = db.rating;
const sequelize = db.sequelize;

const Op = db.Sequelize.Op;

// Create a referral to database
exports.create = (req, res) => {
  // Generate a random number
	var randomNumber = Math.floor(Math.random() * 1000000000);
    Referral.create({
        referral_id: randomNumber,
        user_id: req.userId,
        job_title: req.body.job_title,
        price: req.body.price,
        job_description: req.body.job_description,
        company: req.body.company,
        address: req.body.address
    })
    .then(user => {
        res.status(201).send({referral_id : randomNumber});
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

exports.get = (req, res) => {
    const input_id = req.params.id;
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Referral ID is not a number"
        });
    }
    Referral.findOne({ where: { referral_id: input_id } })
    .then(referral => {
        if (referral) {
            Rating.findOne({ 
                where: { referral_id: referral.dataValues.referral_id },
                attributes: [sequelize.fn("AVG", sequelize.col("rating_score"))],
                raw: true
              })
            .then(rating => {
              var provider_rating = rating.avg;
              if (rating) {
                provider_rating = Math.round(provider_rating * 10) / 10;
              }
              User.findOne({ where: {user_id: referral.dataValues.user_id } })
              .then(user => {
                if (user) {
                  res.send({ 
                    referral_id: referral.dataValues.referral_id,
                    user_id: referral.dataValues.user_id,
                    first_name: user.dataValues.firstName,
                    last_name: user.dataValues.lastName,
                    job_title: referral.dataValues.job_title,
                    price: referral.dataValues.price,
                    job_desciption: referral.dataValues.job_desciption,
                    company: referral.dataValues.company,
                    address: referral.dataValues.address,
                    createdAt: referral.dataValues.createdAt,
                    updatedAt: referral.dataValues.updatedAt,
                    rating: provider_rating
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
            })
            .catch(err => {
              res.status(500).send({
                message: "Fatal error happened"
              });
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

exports.getAll = (req, res) => {
    Referral.findAll({
      raw : true, 
      where: {
        user_id: { 
          [Op.ne]: req.userId
        }
      } 
    })
    .then(referrals => {
      if (referrals) {
        var tempReferrals = [];
        if (referrals.length > 0) {
          referrals.forEach((element) => {
            Rating.findOne({ 
              where: { referral_id: element.referral_id },
              attributes: [sequelize.fn("AVG", sequelize.col("rating_score"))],
              raw: true
            })
            .then(rating => {
            User.findOne({ where: {user_id: element.user_id } })
            .then(user => {
              if (user) {
                var provider_rating = rating.avg;
                if (rating) {
                  provider_rating = Math.round(provider_rating * 10) / 10;
                }
                tempReferrals.push({ 
                  ...element,
                  first_name: user.firstName,
                  last_name: user.lastName,
                  rating: provider_rating
                });
                if (referrals.length == tempReferrals.length) {
                  res.status(200).send(tempReferrals);
                }
              } else {
                res.status(404).send();
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Fatal error happened"
              });
            });
          })
          .catch(err => {
            res.status(500).send({
              message: "Fatal error happened",
              test: err.message
            });
          });
          })
        } else {
          res.status(200).send(tempReferrals);
        }
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

exports.getAllByCurrentUser = (req, res) => {
  Referral.findAll({ raw : true, where: { user_id: req.userId } })
  .then(referrals => {
      if (referrals) {
        var tempReferrals = [];
        if (referrals.length > 0) {
          referrals.forEach((element) => {
            Rating.findOne({ 
              where: { referral_id: element.referral_id },
              attributes: [sequelize.fn("AVG", sequelize.col("rating_score"))],
              raw: true
            })
            .then(rating => {
            User.findOne({ where: {user_id: element.user_id } })
            .then(user => {
              if (user) {
                var provider_rating = rating.avg;
                if (rating) {
                  provider_rating = Math.round(provider_rating * 10) / 10;
                }
                tempReferrals.push({ 
                  ...element,
                  first_name: user.firstName,
                  last_name: user.lastName,
                  rating: provider_rating
                });
                if (referrals.length == tempReferrals.length) {
                  res.status(200).send(tempReferrals);
                }
              } else {
                res.status(404).send();
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Fatal error happened"
              });
            });
          })
          .catch(err => {
            res.status(500).send({
              message: "Fatal error happened",
              test: err.message
            });
          });
          })
        } else {
          res.status(200).send(tempReferrals);
        }
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

exports.update = (req, res) => {
    const input_id = req.params.id; // referral id
    
    if (isNaN(input_id)) {
      return res.status(400).send({
          message: "Referral ID is not a number"
      });
    }

    // First find if referral exists
    Referral.findOne({ where: { referral_id: input_id } })
      .then(data => {
          if (data) {
            // Finally try to update the referral with the corresponding user id
            Referral.update(req.body, {
              where: { referral_id: input_id, user_id: req.userId }
            })
              .then(num => {
                if (num == 1) {
                  res.status(200).send();
                } else {
                  res.status(403).send();
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating Referral with id=" + input_id
                });
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

exports.delete = (req, res) => {
    const input_id = req.params.id; // referral id
    if (isNaN(input_id)) {
      return res.status(400).send({
          message: "Referral ID is not a number"
      });
    }
    // First find if referral exists
    Referral.findOne({ where: { referral_id: input_id} })
      .then(data => {
          if (data) {
            // Finally try to delete the referral with the corresponding user id
            Referral.destroy({
              where: { referral_id: input_id, user_id: req.userId }
            })
              .then(num => {
                if (num == 1) {
                  res.status(200).send();
                } else {
                  res.status(403).send();
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Could not delete Referral with id=" + input_id
                });
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


exports.searchQuery = (req, res) => {
  const job_title = req.query.job_title;
  const location = req.query.location;
  const company = req.query.company;
  const isAsc = req.query.asc;
  var condition = {
    where: {
      user_id: { 
        [Op.ne]: req.userId
      }
    },
    raw: true
  };
  if (job_title || location || company) {
    var sub_conditions = [];
    if (job_title) {
      sub_conditions.push({ job_title: { [Op.iLike]: `%${job_title}%` } });
    }
    if (location) {
      sub_conditions.push({ address: { [Op.iLike]: `%${location}%` } });
    }
    if (company) {
      sub_conditions.push({ company: { [Op.iLike]: `%${company}%` } });
    }
    condition = {
      where: {
        [Op.and]: sub_conditions,
        user_id: { 
          [Op.ne]: req.userId
        }
      },
      raw: true
    }
  }

  Referral.findAll(condition)
    .then(referrals => {
      if (referrals) {
        var tempReferrals = [];
        if (referrals.length > 0) {
          referrals.forEach((element) => {
            Rating.findOne({ 
              where: { referral_id: element.referral_id },
              attributes: [sequelize.fn("AVG", sequelize.col("rating_score"))],
              raw: true
            })
            .then(rating => {
            User.findOne({ where: {user_id: element.user_id } })
            .then(user => {
              if (user) {
                var provider_rating = rating.avg;
                if (rating) {
                  provider_rating = Math.round(provider_rating * 10) / 10;
                }
                tempReferrals.push({ 
                  ...element,
                  first_name: user.firstName,
                  last_name: user.lastName,
                  rating: provider_rating
                });
                if (referrals.length == tempReferrals.length) {
                  if (!isAsc || isAsc === "false") {
                    tempReferrals.sort(compareDesc); // Sort list
                  } else {
                    tempReferrals.sort(compareAsc); // Sort list
                  }
                  res.status(200).send(tempReferrals);
                }
              } else {
                res.status(404).send();
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Fatal error happened"
              });
            });
          })
          .catch(err => {
            res.status(500).send({
              message: "Fatal error happened",
              test: err.message
            });
          });
          })
        } else {
          res.status(200).send(tempReferrals);
        }
      } else {
          res.status(404).send();
      }
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the query."
      });
    });
};


// Sort array of objects influenced from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
compareDesc = ( a, b ) => {
	if ( a.price > b.price ){
	  return -1;
	}
	if ( a.price < b.price ){
	  return 1;
	}
	return 0;
}

// Sort array of objects influenced from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
compareAsc = ( a, b ) => {
	if ( a.price < b.price ){
	  return -1;
	}
	if ( a.price > b.price ){
	  return 1;
	}
	return 0;
}