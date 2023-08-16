const express = require("express");
const voterRouter = express.Router();

const Voter = require("../models/Voter");
const Vote = require("../models/Vote");
const keyGenerators = require("../utils/KeyGeneration");
const Candidate = require("../models/Candidate");
const buffer = require("buffer");

const crypto = require("crypto");
const { Router } = require("express");

voterRouter.get("/get-all-voters", async (req, res) => {
  try {
    var allVoters = await Voter.find();
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
});

voterRouter.get("/get-voter/:id", async (req, res) => {
  try {
    var _id = req.params.id;
    console.log(_id);
    if (_id !== undefined && _id != null) {
      var voters = await Voter.find({ _id: _id }).populate("election");
    } else {
      var voters = await Voter.find();
    }
    if (!voters.length <= 0) {
      res.json({
        status: "200",
        voters: voters,
        message: "Voter found with given id",
      });
    } else {
      res.json({
        status: "404",
        message: "Voter not found with given id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "internal server error",
    });
  }
});

voterRouter.delete("/delete-voter/:id", async (req, res) => {
  try {
    var voterId = req.params.id;
    var filter = { _id: voterId };

    var searchedUser = await Voter.findOneAndDelete(filter, {
      rawResult: true,
    })
      .then(function (result) {
        if (result.value === null) {
          res.status(404).json({
            status: "404",
            message: "No voter found with given id",
          });
        } else {
          if (result.lastErrorObject.n >= 1) {
            res.status(200).json({
              status: "200",
              message: "Voter deleted successfully",
            });
          }
        }
      })
      .catch(function (err) {
        var responseData = {
          error: err,
          status: "500",
          message: "Internal Server Error!",
        };
        res.status(500).json(responseData);
      });
  } catch (error) {
    res.send(error);
  }
});

voterRouter.put("/update-voter/:id", async (req, res) => {
  try {
    var { email_address, first_name, last_name, phone_no } = req.body;

    var filter = { _id: req.params.id };
    var update = {
      first_name: first_name,
      last_name: last_name,
      email_address: email_address,
      phone_no: phone_no,
    };

    var searchedVoter = await Voter.findByIdAndUpdate(filter, update, {
      new: true,
      rawResult: true,
    })
      .then(function (result) {
        console.log(result.value);
        if (result.value === null) {
          var responseData = {
            status: "404",
            message: "No voter found with given id",
          };
          res.status(404).json(responseData);
        } else {
          if (result.lastErrorObject.updatedExisting === true) {
            var responseData = {
              status: "200",
              message: "Voter updated successfully!",
              updatedDocument: result.value,
            };
            res.status(200).json(responseData);
          } else {
            var responseData = {
              status: "202",
              message: "Voter data not updated yet!",
            };
            res.status(202).json(responseData);
          }
        }
      })
      .catch(function (err) {
        var responseData = {
          error: err,
          message: "Error Occured!",
          status: "400",
        };
        res.status(400).json(responseData);
      });
  } catch (error) {
    res.status(500).json({
      error: error,
      status: "500",
      message: "Internal server error!",
    });
  }
});

voterRouter.patch("/register-election/:voter_id", async (req, res) => {
  try {
    var { election_id } = req.body;
    var voter_id = req.params.voter_id;

    var filter = { _id: voter_id };
    var update = {
      election: election_id,
    };

    var updatedVoterDoc = await Voter.findByIdAndUpdate(filter, update, {
      new: true,
    })
      .then((result) => {
        res.json({
          message: "Voter registered to a election!",
          status: "200",
          updatedVoter: result,
        });
      })

      .catch((error) => {
        res.json({
          message: "Error occurred while registering to a election!",
          status: "400",
          error,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
});

voterRouter.post("/cast-vote/:id", async (req, res) => {
  try {
    var voter_id = req.params.id;

    var { election_id, candidate_id } = req.body;
    var voter = await Voter.findById({
      _id: voter_id,
    });
    var candidate = await Candidate.findById({
      _id: candidate_id,
    });

    console.log("Candidate Found: ", candidate);

    var data = {
      voter: voter._id,
    };

    var keyPair = keyGenerators.generateKeyPair();
    console.log("key pair: ", JSON.stringify(keyPair));

    var bufferData = Buffer.from(voter._id);

    const sign = crypto.createSign("SHA256");
    sign.update(bufferData);

    var signature = crypto.sign("SHA256", bufferData, keyPair.privateKey);

    var vote = new Vote({
      voter: voter._id,
      candidate: candidate._id,
      election: election_id,
      public_key: keyPair.publicKey,
      signature: signature,
    });

    var savedVote = await vote.save();
    var filter = {
      _id: voter._id,
    };
    var voterUpdateData = {
      public_key: keyPair.publicKey,
      private_key: keyPair.privateKey,
      signature: signature,
      has_voted: true,
    };

    var updatedVoter = await Voter.findByIdAndUpdate(filter, voterUpdateData, {
      new: true,
    })
      .then(async (updatedVoterResult) => {
        console.log("Updated Voter: ", updatedVoterResult);

        var candidateFilter = {
          _id: candidate._id,
        };
        var updatedCount = candidate.total_votes + 1;
        console.log("Updated count var: ", updatedCount);
        var candidateUpdateData = {
          total_votes: updatedCount,
        };
        console.log("After simple update count: ", candidateUpdateData);

        var updatedCandidate = await Candidate.findByIdAndUpdate(
          candidateFilter,
          candidateUpdateData,
          {
            new: true,
          }
        )

          .then((updatedCandidateResult) => {
            console.log("Updated Candidate: ", updatedCandidateResult);
            res.json({
              message: "Vote casted!",
              status: "200",
              vote: savedVote,
              voter: updatedVoterResult,
              candidate: updatedCandidateResult,
            });
          })

          .catch((error) => {
            console.log("Error in candidate update: ", error);
            res.json({
              message: "Something went wrong while vote casting!",
              status: "400",
              error,
            });
          });
      })
      .catch((error) => {
        console.log("Database error: ", error);
        res.json({
          message: "Something went wrong while vote casting!",
          status: "400",
          error,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
});

voterRouter.post("/verify-vote/:id", async (req, res) => {
  try {
    var voter_id = req.params.id;
    var voter = await Voter.findById({
      _id: voter_id,
    });

    var vote = await Vote.findOne({
      voter: voter._id,
    });

    console.log("vote: ", vote);

    var voter_public_key = voter.public_key;
    var voter_signature = Buffer.from(voter.signature);

    var vote_public_key = vote.public_key;
    var vote_signature = vote.signature;

    console.log("Public vote: ", vote_public_key);
    console.log("Public voter: ", voter_public_key);

    // var data = Buffer.from(voter._id);

    var isVerifiedVote = voter_public_key === vote_public_key;

    // var isVerifiedVote = crypto.verify("SHA256", data, public_key, signature);

    if (isVerifiedVote) {
      res.json({
        message: "Vote is verified!",
        status: "200",
      });
    } else {
      res.json({
        message: "Vote is not verifed!",
        status: "400",
      });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
});

voterRouter.get("/get-registered-election/:id", async (req, res) => {
  try {
    var voter_id = req.params.id;

    var voter = await Voter.findById({
      _id: voter_id,
    }).populate("election");

    if (!voter) {
      res.json({
        message: "No voter found with provided id!",
        status: "404",
      });
    } else {
      res.json({
        message: "Found registered election",
        status: "200",
        election: voter.election,
      });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
    });
  }
});

const { voterResetPassword } = require("../controllers/ForgotPassword");

voterRouter.post("/reset-password/:voter_id", voterResetPassword);

module.exports = voterRouter;
