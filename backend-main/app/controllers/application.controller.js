const db = require("../models");
const Application = db.application;
const Referral = db.referral;
const User = db.user;
require('dotenv').config();
const path = require('path');
const { application } = require("../models");
const { nextTick } = require("process");

exports.create = (req, res) => {
    if (isNaN(req.body.referral_id)) {
        return res.status(400).send({
            message: "Referral ID is not a number"
        });
    }
    // Generate a random number 
    var randomNumber = Math.floor(Math.random() * 1000000000);
    // Move the uploaded file to new place
    const fs = require('fs')
    const oldPath = req.files.cv_file.path;
    const oldPathSplit = oldPath.split(".");
    const newPath = "./" + process.env.CV_UPLOAD_FOLDER + "/" + randomNumber + "." + oldPathSplit[oldPathSplit.length - 1];
    
    fs.copyFile(oldPath, newPath, (error) => {
        if (error) {
            res.status(500).send();
            throw error
        } else {
            console.log('File has been moved to another folder.')
        }
    });
    Application.create({
        application_id: randomNumber,
        referral_id: req.body.referral_id,
        user_id: req.userId,
        application_status: "pending",
        application_file_name: randomNumber + "." + oldPathSplit[oldPathSplit.length - 1],
        proof_file_name: null
    })
        .then(application => {
            res.status(201).send({application_id : randomNumber});
        })
        .catch(err => {
            var badRequestSubstring = ["notNull Violation"];
            if (badRequestSubstring.some(str => err.message.includes(str))) {
                res.status(400).send({ message: err.message.split(",\n")});
            } else {
                res.status(500).send({ message: err.message.split(",\n")});
            }
        });
}

exports.get = (req, res) => {
    const input_id = req.params.id;
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Application ID is not a number"
        });
    }
    Application.findOne({ where: { application_id: input_id }, raw:true })
        .then(application => {
            if (application) {
                Referral.findOne({ where: { referral_id: application.referral_id }, raw:true })
                .then(referral => {
                    // Check if referral is null
                    if (referral) {
                        // Check if the one searching for this is either the author of referral id or creator of the application id
                        if (referral.user_id == req.userId || application.user_id == req.userId) {
                            User.findOne({ where: {user_id: application.user_id}, raw:true })
                            .then(referral_user => {
                                User.findOne({ where: {user_id: referral.user_id}, raw:true })
                                .then(application_user => {
                                    res.status(200).send({ 
                                        referral_id: referral.referral_id,
                                        author_id: referral.user_id,
                                        job_title: referral.job_title,
                                        price: referral.price,
                                        job_description: referral.job_description,
                                        company: referral.company,
                                        skill: referral.skill,
                                        address: referral.address,
                                        referral_name: referral_user.firstName + " " + referral_user.lastName,
                                        referral_createdAt: referral.createdAt,
                                        referral_updatedAt: referral.updatedAt,
                                        application_id: application.application_id,
                                        application_user_id: application.user_id,
                                        application_status: application.application_status,
                                        application_file_name: application.application_file_name,
                                        application_proof_file_name: application.proof_file_name,
                                        application_createdAt: application.createdAt,
                                        application_updatedAt: application.updatedAt,
                                        application_name: application_user.firstName + " " + application_user.lastName
                                    });
                                });
                            });

                        } else {
                            res.status(403).send();
                        }
                    } else {
                        res.status(500).send();
                    }
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
}

exports.getAllByCurrentUser = async (req, res) => {
    Application.findAll({ raw : true, where: { user_id: req.userId }, raw:true })
    .then(applications => {
        if (applications) {
            var tempApplications = [];
            if (applications.length > 0) {
                applications.forEach((element) => {
                Referral.findOne({ where: { referral_id: element.referral_id }, raw:true })
                .then(referral => {
                    User.findOne({ where: {user_id: element.user_id}, raw:true })
                    .then(referral_user => {
                        User.findOne({ where: {user_id: referral.user_id}, raw:true })
                        .then(application_user => {
                            tempApplications.push({
                                referral_id: referral.referral_id,
                                author_id: referral.user_id,
                                job_title: referral.job_title,
                                price: referral.price,
                                job_description: referral.job_description,
                                company: referral.company,
                                skill: referral.skill,
                                address: referral.address,
                                referral_name: referral_user.firstName + " " + referral_user.lastName,
                                referral_createdAt: referral.createdAt,
                                referral_updatedAt: referral.updatedAt,
                                application_id: element.application_id,
                                application_user_id: element.user_id,
                                application_status: element.application_status,
                                application_file_name: element.application_file_name,
                                application_proof_file_name: element.proof_file_name,
                                application_createdAt: element.createdAt,
                                application_updatedAt: element.updatedAt,
                                application_name: application_user.firstName + " " + application_user.lastName
                            })
                            if (applications.length == tempApplications.length) {
                                res.status(200).send(tempApplications);
                            }
                        });
                    });
                })
                
            })
            } else {
                res.status(200).send(tempApplications);
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
}

exports.getApplicationFile = (req, res) => {
    const input_id = req.params.id;
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Application ID is not a number"
        });
    }
    Application.findOne({ where: { application_id: input_id } })
        .then(application => {
            if (application) {
                Referral.findOne({ where: { referral_id: application.dataValues.referral_id } })
                .then(referral => {
                    // Check if referral is null
                    if (referral) {
                        // Check if the one searching for this is either the author of referral id or creator of the application id
                        if (referral.dataValues.user_id == req.userId || application.dataValues.user_id == req.userId) {
                            var filePath = __dirname.replace("app/controllers", "/" + process.env.CV_UPLOAD_FOLDER + "/" + application.dataValues.application_file_name)
                            res.status(200).sendFile(filePath);

                        } else {
                            res.status(403).send();
                        }
                    } else {
                        res.status(500).send();
                    }
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
}

exports.delete = (req, res) => {

    const input_id = req.params.id;

    // First find if the application exists
    Application.findOne({ where: { application_id: input_id} })
      .then(data => {
          if (data) {
            // Finally try to delete the application with the corresponding user id
            Application.destroy({
              where: { application_id: input_id, user_id: req.userId }
            })
              .then(num => {
                if (num == 1) {
                    const fs = require('fs');
                    fs.unlinkSync("./" + process.env.CV_UPLOAD_FOLDER + "/" + data.dataValues.application_file_name);
                    if (data.dataValues.proof_file_name) {
                        fs.unlinkSync("./" + process.env.PROOF_UPLOAD_FOLDER + "/" + data.dataValues.proof_file_name);
                    }
                    res.status(200).send();
                } else {
                    res.status(403).send();
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Could not delete Application with id=" + input_id
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
}

// To deprecate
exports.update = (req, res) => {
    const input_id = req.params.id; // referral id
    
    if (isNaN(input_id)) {
      return res.status(400).send({
          message: "Application ID is not a number"
      });
    }

    // First find if application exists
    Application.findOne({ where: { application_id: input_id } })
      .then(application => {
          if (application) {
            Referral.findOne({ where: { referral_id: application.dataValues.referral_id } })
                .then(referral => {
                    // Check if referral is null
                    if (referral) {
                        // Check if the one searching for this is either the author of referral id or creator of the application id
                        if (referral.dataValues.user_id == req.userId || application.dataValues.user_id == req.userId) {
                            var newUpdate = {
                                application_status: req.body.application_status
                            };
                            // If a new file is included in the request
                            if (typeof req.files.cv_file != "undefined") {
                                // Move the uploaded file to new place
                                const fs = require('fs');
                                const oldPath = req.files.cv_file.path;
                                const oldPathSplit = oldPath.split(".");
                                const newPath = "./" + process.env.CV_UPLOAD_FOLDER + "/" + input_id + "." + oldPathSplit[oldPathSplit.length - 1];
                                fs.unlinkSync("./" + process.env.CV_UPLOAD_FOLDER + "/" + application.dataValues.application_file_name);
                                fs.copyFile(oldPath, newPath, (error) => {
                                    if (error) {
                                        res.status(500).send();
                                        throw error
                                    } else {
                                        console.log('File has been moved to another folder.')
                                    }
                                });
                                newUpdate.application_file_name = input_id + "." + oldPathSplit[oldPathSplit.length - 1];
                            }
                            // Finally try to update the application
                            Application.update(newUpdate, {
                                where: { application_id: input_id }
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
                                    message: "Error updating Application with id=" + input_id
                                  });
                                });

                        } else {
                            res.status(403).send(); // Forbidden as user is not an author of referral id or creator of the application id
                        }
                    } else {
                        res.status(500).send();
                    }
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

// Update application status to "accepted" or "declined"
exports.acceptOrDecline = (req, res, next) => {
    const input_id = req.params.id; // application id
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Application ID is not a number"
        });
    }
    var status = req.params.status;
    if (status === "cancel") {
        return next(); // skip this controller if is "cancel"
    }
    if (status !== "accept" && status !== "decline") {
        return res.status(400).send({
            message: "Application status can only be 'accept' or 'decline'"
        });
    }
    status = (status === "accept") ? "referring" : "declined";
    // First find if application exists
    Application.findOne({ where: { application_id: input_id } })
    .then(application => {
        if (application) {
            // Check if the application status is "pending" to proceed
            if (application.dataValues.application_status === "pending") {
                // Find the corresponding referral by the referral id
                Referral.findOne({ where: { referral_id: application.dataValues.referral_id } })
                .then(referral => {
                    // Check if referral is null
                    if (referral) {
                        // Check if the one searching for this is the author of the referral
                        if (referral.dataValues.user_id == req.userId) {
                            var newUpdate = {
                                application_status: status
                            };
                            // Finally try to update the application
                            Application.update(newUpdate, {
                                where: { application_id: input_id }
                                })
                                .then(num => {
                                    if (num == 1) {
                                        res.status(200).send();
                                    } else {
                                        res.status(500).send();
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send({
                                    message: "Error updating Application with id=" + input_id
                                    });
                                });

                        } else {
                            res.status(403).send(); // Forbidden as user is not the author of the referral
                        }
                    } else {
                        res.status(500).send();
                    }
                });
            } else {
                res.status(400).send();
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

// Update application status to "cancelled"
exports.cancel = (req, res) => {
    const input_id = req.params.id; // application id
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Application ID is not a number"
        });
    }
    // First find if application exists
    Application.findOne({ where: { application_id: input_id } })
    .then(application => {
        if (application) {
            // Check if the application status is "pending" to proceed
            if (application.dataValues.application_status === "pending") {
                // Check if the one searching for this is the creator of the application id
                if (application.dataValues.user_id == req.userId) {
                    var newUpdate = {
                        application_status: "cancelled"
                    };
                    // Finally try to update the application
                    Application.update(newUpdate, {
                        where: { application_id: input_id }
                        })
                        .then(num => {
                            if (num == 1) {
                                res.status(200).send();
                            } else {
                                res.status(500).send();
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                            message: "Error updating Application with id=" + input_id
                            });
                        });

                } else {
                    res.status(403).send(); // Forbidden as user is not the creator of the application id
                }
                
            } else {
                res.status(400).send();
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

// Get all applications by referral id
exports.getAllByReferral = (req, res) => {
    const input_id = req.params.referral_id; // referral id
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Referral ID is not a number"
        });
    }

    Application.findAll({ raw : true, where: { referral_id: input_id }, raw: true })
    .then(applications => {
        if (applications) {
            var tempApplications = [];
            if (applications.length > 0) {
                applications.forEach((element) => {
                Referral.findOne({ where: { referral_id: element.referral_id }, raw: true })
                .then(referral => {
                    User.findOne({ where: {user_id: element.user_id}, raw: true })
                    .then(referral_user => {
                        User.findOne({ where: {user_id: referral.user_id}, raw: true })
                        .then(application_user => {
                            tempApplications.push({
                                referral_id: referral.referral_id,
                                author_id: referral.user_id,
                                job_title: referral.job_title,
                                price: referral.price,
                                job_description: referral.job_description,
                                company: referral.company,
                                skill: referral.skill,
                                address: referral.address,
                                referral_name: referral_user.firstName + " " + referral_user.lastName,
                                referral_createdAt: referral.createdAt,
                                referral_updatedAt: referral.updatedAt,
                                application_id: element.application_id,
                                application_user_id: element.user_id,
                                application_status: element.application_status,
                                application_file_name: element.application_file_name,
                                application_proof_file_name: element.proof_file_name,
                                application_createdAt: element.createdAt,
                                application_updatedAt: element.updatedAt,
                                application_name: application_user.firstName + " " + application_user.lastName
                            })
                            if (applications.length == tempApplications.length) {
                                res.status(200).send(tempApplications);
                            }
                        });
                    });
                })
                
            })
            } else {
                res.status(200).send(tempApplications);
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

exports.uploadProof = (req, res) => {
    const input_id = req.body.application_id;

    // First find if application exists
    Application.findOne({ where: { application_id: input_id } })
      .then(application => {
          if (application) {
            // Check if the application status is "referring" to proceed
            if (application.dataValues.application_status === "referring") {
                Referral.findOne({ where: { referral_id: application.dataValues.referral_id } })
                .then(referral => {
                    // Check if referral is null
                    if (referral) {
                        // Check if the one updating for this is either the author of the referral
                        if (referral.dataValues.user_id == req.userId) {
                            var newUpdate = {
                                application_status: "rating"
                            };
                            
                            // Move the uploaded file to new place
                            const fs = require('fs')
                            const oldPath = req.files.proof_file.path;
                            const oldPathSplit = oldPath.split(".");
                            const newPath = "./" + process.env.PROOF_UPLOAD_FOLDER + "/" + input_id + "." + oldPathSplit[oldPathSplit.length - 1];
                            fs.copyFile(oldPath, newPath, (error) => {
                                if (error) {
                                    res.status(500).send();
                                    throw error
                                } else {
                                    console.log('File has been moved to another folder.')
                                }
                            });
                            newUpdate.proof_file_name = input_id + "." + oldPathSplit[oldPathSplit.length - 1];
                            
                            // Finally try to update the application
                            Application.update(newUpdate, {
                                where: { application_id: input_id }
                                })
                                .then(num => {
                                    if (num == 1) {
                                    res.status(200).send();
                                    } else {
                                    res.status(500).send();
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send({
                                    message: "Error updating Application with id=" + input_id
                                    });
                                });

                        } else {
                            res.status(403).send(); // Forbidden as user is not an author of the referral
                        }
                    } else {
                        res.status(500).send();
                    }
                });
            } else {
                res.status(400).send();
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

exports.getProofFile = (req, res) => {
    const input_id = req.params.id;
    if (isNaN(input_id)) {
        return res.status(400).send({
            message: "Application ID is not a number"
        });
    }
    Application.findOne({ where: { application_id: input_id } })
        .then(application => {
            if (application) {
                // Check if file field is null
                if (application.dataValues.proof_file_name) {
                    Referral.findOne({ where: { referral_id: application.dataValues.referral_id } })
                    .then(referral => {
                        // Check if referral is null
                        if (referral) {
                            // Check if the one searching for this is either the author of referral id or creator of the application id
                            if (referral.dataValues.user_id == req.userId || application.dataValues.user_id == req.userId) {
                                var filePath = __dirname.replace("app/controllers", "/" + process.env.PROOF_UPLOAD_FOLDER + "/" + application.dataValues.proof_file_name)
                                res.status(200).sendFile(filePath);
    
                            } else {
                                res.status(403).send();
                            }
                        } else {
                            res.status(500).send();
                        }
                    });
                } else {
                    res.status(400).send();
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
}