const Admin = require("../models/Admin");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

const saveAdminNotificationToken = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;

    var { notification_token } = req.body;

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
            var filter = {
              _id: onAdminFound._id,
            };

            var updatedData = {
              notification_token: notification_token,
            };

            var updatedAdmin = await Admin.findByIdAndUpdate(
              filter,
              updatedData,
              {
                new: true,
              }
            )
              .then((onAdminUpdate) => {
                console.log("on admin update: ", onAdminUpdate);

                res.json({
                  message: "Notification token saved!",
                  status: "200",
                  admin: onAdminUpdate,
                });
              })
              .catch((onAdminUpdateError) => {
                console.log("on admin update error: ", onAdminUpdateError);
                res.json({
                  message:
                    "Something went wrong while saving notification token!",
                  status: "400",
                  error: onAdminUpdateError,
                });
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

const saveCandidateNotificationToken = async (req, res) => {
  try {
    var candidate_id = req.params.candidate_id;

    var { notification_token } = req.body;

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
            var filter = {
              _id: onCandidateFound._id,
            };

            var updatedData = {
              notification_token: notification_token,
            };

            var updatedCandidate = await Candidate.findByIdAndUpdate(
              filter,
              updatedData,
              {
                new: true,
              }
            )
              .then((onCandidateUpdate) => {
                console.log("on candidate update: ", onCandidateUpdate);

                res.json({
                  message: "Notification token saved!",
                  status: "200",
                  candidate: onCandidateUpdate,
                });
              })
              .catch((onCandidateUpdateError) => {
                console.log(
                  "on candidate update error: ",
                  onCandidateUpdateError
                );
                res.json({
                  message:
                    "Something went wrong while saving notification token!",
                  status: "400",
                  error: onCandidateUpdateError,
                });
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

const saveVoterNotificationToken = async (req, res) => {
  try {
    var voter_id = req.params.voter_id;

    var { notification_token } = req.body;

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
            var filter = {
              _id: onVoterFound._id,
            };

            var updatedData = {
              notification_token: notification_token,
            };

            var updatedVoter = await Voter.findByIdAndUpdate(
              filter,
              updatedData,
              {
                new: true,
              }
            )
              .then((onVoterUpdate) => {
                console.log("on voter update: ", onVoterUpdate);

                res.json({
                  message: "Notification token saved!",
                  status: "200",
                  voter: onVoterUpdate,
                });
              })
              .catch((onVoterUpdateError) => {
                console.log("on voter update error: ", onVoterUpdateError);
                res.json({
                  message:
                    "Something went wrong while saving notification token!",
                  status: "400",
                  error: onVoterUpdateError,
                });
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
const getAllVoterNotificationTokens = async (req, res) => {
  try {
    const voters = await Voter.find({}, "notification_token");

    if (voters.length === 0) {
      res.json({
        message: "No voters found!",
        status: "404",
      });
    } else {
      const notificationTokens = voters.map(
        (voter) => voter.notification_token
      );
      res.json({
        message: "Voter notification tokens retrieved successfully!",
        status: "200",
        notificationTokens,
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

const getAllAdminNotificationTokens = async (req, res) => {
  try {
    const admins = await Admin.find({}, "notification_token");

    if (admins.length === 0) {
      res.json({
        message: "No admins found!",
        status: "404",
      });
    } else {
      const notificationTokens = admins.map(
        (admin) => admin.notification_token
      );
      res.json({
        message: "Admin notification tokens retrieved successfully!",
        status: "200",
        notificationTokens,
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

const getAllCandidateNotificationTokens = async (req, res) => {
  try {
    const candidates = await Candidate.find({}, "notification_token");

    if (candidates.length === 0) {
      res.json({
        message: "No candidates found!",
        status: "404",
      });
    } else {
      const notificationTokens = candidates.map(
        (candidate) => candidate.notification_token
      );
      res.json({
        message: "Candidate notification tokens retrieved successfully!",
        status: "200",
        notificationTokens,
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

const getVotersOfAElection = async (req, res) => {
  try {
    var election_id = req.params.election_id;
    var allVoters = await Voter.find({
      election: election_id,
    });
    if (allVoters && allVoters.length >= 0) {
      res.status(200).json({
        status: "200",
        message: "Voters Found!",
        allVoters: allVoters,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "No Voters Found",
        allVoters: allVoters,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  saveAdminNotificationToken,
  saveCandidateNotificationToken,
  saveVoterNotificationToken,
  getAllVoterNotificationTokens,
  getAllAdminNotificationTokens,
  getAllCandidateNotificationTokens,
  getVotersOfAElection,
};
