const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

const adminResetPassword = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;
    var { new_password, new_confirm_password } = req.body;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var admin = await Admin.findById(admin_id)
        .then(async (onAdminFound) => {
          console.log("on admin found: ", onAdminFound);

          if (onAdminFound === null) {
            res.json({
              message: "Admin not found!",
              status: "404",
            });
          } else {
            if (new_password !== new_confirm_password) {
              res.json({
                message: "Password and confirm password should be same!",
                status: "400",
              });
            } else {
              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(
                new_password,
                saltRounds
              );

              var filter = {
                _id: onAdminFound._id,
              };

              var updatedData = {
                password: hashedPassword,
              };

              var updatedAdmin = await Admin.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then((onPasswordReset) => {
                  console.log("on password reset: ", onPasswordReset);

                  res.json({
                    message: "Admin password reset successfully!",
                    status: "200",
                  });
                })
                .catch((onPasswordResetError) => {
                  console.log(
                    "on password reset error: ",
                    onPasswordResetError
                  );
                  res.json({
                    message:
                      "Something went wrong while resetting the password!",
                    status: "400",
                    error: onPasswordResetError,
                  });
                });
            }
          }
        })
        .catch((onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin not found!",
            status: "404",
            error: onAdminFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const candidateResetPassword = async (req, res) => {
  try {
    var candidate_id = req.params.candidate_id;
    var { new_password, new_confirm_password } = req.body;

    if (!candidate_id || candidate_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var candidate = await Candidate.findById(candidate_id)
        .then(async (onCandidateFound) => {
          console.log("on candidate found: ", onCandidateFound);

          if (onCandidateFound === null) {
            res.json({
              message: "Candidate not found!",
              status: "404",
            });
          } else {
            if (new_password !== new_confirm_password) {
              res.json({
                message: "Password and confirm password should be the same!",
                status: "400",
              });
            } else {
              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(
                new_password,
                saltRounds
              );

              var filter = {
                _id: onCandidateFound._id,
              };

              var updatedData = {
                password: hashedPassword,
              };

              var updatedCandidate = await Candidate.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then((onPasswordReset) => {
                  console.log("on password reset: ", onPasswordReset);

                  res.json({
                    message: "Candidate password reset successfully!",
                    status: "200",
                  });
                })
                .catch((onPasswordResetError) => {
                  console.log(
                    "on password reset error: ",
                    onPasswordResetError
                  );
                  res.json({
                    message:
                      "Something went wrong while resetting the password!",
                    status: "400",
                    error: onPasswordResetError,
                  });
                });
            }
          }
        })
        .catch((onCandidateFoundError) => {
          console.log("on candidate found error: ", onCandidateFoundError);
          res.json({
            message: "Candidate not found!",
            status: "404",
            error: onCandidateFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const voterResetPassword = async (req, res) => {
  try {
    var voter_id = req.params.voter_id;
    var { new_password, new_confirm_password } = req.body;

    if (!voter_id || voter_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var voter = await Voter.findById(voter_id)
        .then(async (onVoterFound) => {
          console.log("on voter found: ", onVoterFound);

          if (onVoterFound === null) {
            res.json({
              message: "Voter not found!",
              status: "404",
            });
          } else {
            if (new_password !== new_confirm_password) {
              res.json({
                message: "Password and confirm password should be the same!",
                status: "400",
              });
            } else {
              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(
                new_password,
                saltRounds
              );

              var filter = {
                _id: onVoterFound._id,
              };

              var updatedData = {
                password: hashedPassword,
              };

              var updatedVoter = await Voter.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then((onPasswordReset) => {
                  console.log("on password reset: ", onPasswordReset);

                  res.json({
                    message: "Voter password reset successfully!",
                    status: "200",
                  });
                })
                .catch((onPasswordResetError) => {
                  console.log(
                    "on password reset error: ",
                    onPasswordResetError
                  );
                  res.json({
                    message:
                      "Something went wrong while resetting the password!",
                    status: "400",
                    error: onPasswordResetError,
                  });
                });
            }
          }
        })
        .catch((onVoterFoundError) => {
          console.log("on voter found error: ", onVoterFoundError);
          res.json({
            message: "Voter not found!",
            status: "404",
            error: onVoterFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const findVoter = async (req, res) => {
  try {
    var { email_address } = req.body;

    if (!email_address || email_address === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var voter = await Voter.findOne({
        email_address: email_address,
      })
        .then((onVoterFound) => {
          console.log("on voter found: ", onVoterFound);

          if (onVoterFound === null) {
            res.json({
              message: "Voter not found!",
              status: "404",
            });
          } else {
            res.json({
              message: "Voter found!",
              status: "200",
              voter: onVoterFound,
            });
          }
        })
        .catch((onVoterFoundError) => {
          console.log("on voter found error: ", onVoterFoundError);
          res.json({
            message: "Voter not found!",
            status: "404",
            error: onVoterFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const findCandidate = async (req, res) => {
  try {
    var { email_address } = req.body;

    if (!email_address || email_address === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var candidate = await Candidate.findOne({
        email_address: email_address,
      })
        .then((onCandidateFound) => {
          console.log("on candidate found: ", onCandidateFound);

          if (onCandidateFound === null) {
            res.json({
              message: "Candidate not found!",
              status: "404",
            });
          } else {
            res.json({
              message: "Candidate found!",
              status: "200",
              candidate: onCandidateFound,
            });
          }
        })
        .catch((onCandidateFoundError) => {
          console.log("on candidate found error: ", onCandidateFoundError);
          res.json({
            message: "Candidate not found!",
            status: "404",
            error: onCandidateFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const findAdmin = async (req, res) => {
  try {
    var { email_address } = req.body;

    if (!email_address || email_address === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var admin = await Admin.findOne({
        email_address: email_address,
      })
        .then((onAdminFound) => {
          console.log("on admin found: ", onAdminFound);

          if (onAdminFound === null) {
            res.json({
              message: "Admin not found!",
              status: "404",
            });
          } else {
            res.json({
              message: "Admin found!",
              status: "200",
              admin: onAdminFound,
            });
          }
        })
        .catch((onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin not found!",
            status: "404",
            error: onAdminFoundError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  adminResetPassword,
  candidateResetPassword,
  voterResetPassword,
  findVoter,
  findCandidate,
  findAdmin,
};
