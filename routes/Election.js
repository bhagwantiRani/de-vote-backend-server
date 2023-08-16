const express = require("express");
const electionRouter = express.Router();

const Election = require("../models/Election");
const { sendPushNotificationToElectionVoters } = require("../utils/FCM");

electionRouter.get("/get-all-elections", async (req, res) => {
  try {
    var allElections = await Election.find();
    if (allElections && allElections.length >= 0) {
      res.status(200).json({
        status: "200",
        message: "Elections Found!",
        allElections: allElections,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "No Elections Found",
        allElections: allElections,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
});

electionRouter.get("/get-election/:id", async (req, res) => {
  try {
    var _id = req.params.id;
    if (_id !== undefined && _id != null) {
      var elections = await Election.find({ _id: _id });
    } else {
      var elections = await Election.find();
    }
    if (!elections.length <= 0) {
      res.json({
        status: "200",
        elections: elections,
        message: "Election found with given id",
      });
    } else {
      res.json({
        status: "404",
        message: "Election not found with given id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "internal server error",
    });
  }
});

electionRouter.post("/create-election", async (req, res) => {
  try {
    var { start_date, end_date, name } = req.body;

    const newElection = new Election({
      name,
      start_date,
      end_date,
    });

    var savedElection = await newElection.save();
    res.status(200).json({
      status: "200",
      message: "New Election Created!",
      savedElection: savedElection,
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

electionRouter.delete("/delete-election/:id", async (req, res) => {
  try {
    var electionId = req.params.id;
    var filter = { _id: electionId };

    var searchedElection = await Election.findOneAndDelete(filter, {
      rawResult: true,
    })
      .then(function (result) {
        if (result.value === null) {
          res.status(404).json({
            status: "404",
            message: "No Election found with given id",
          });
        } else {
          if (result.lastErrorObject.n >= 1) {
            res.status(200).json({
              status: "200",
              message: "Election deleted successfully",
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

electionRouter.post("/add-candidate-to-election/:id", async (req, res) => {
  var { candidate_id } = req.body;

  Election.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { candidates: candidate_id } },
    function (err) {
      if (err) {
        // handle error
        res.status(404).json({
          status: "404",
          message: "No Election Found",
          err: err,
        });
      } else {
        res.status(200).json({
          status: "200",
          message: "Candidate Added To Election!",
        });
        sendPushNotificationToElectionVoters(req.params.id, 'Election Update', 'Election has a new candidate!');
      }
    }
  );
});

electionRouter.get("/get-election-candidates/:id", async (req, res) => {
  try {
    var electionId = req.params.id;
    var data = await Election.find({
      _id: electionId,
    })
      .populate("candidates")
      .exec(function (err, candidates) {
        if (err) {
          res.status(404).json({
            status: "400",
            message: "No Election Found!",
            err: err,
          });
        } else {
          res.json({
            status: "200",
            election_start_date: candidates[0].start_date,
            election_end_date: candidates[0].end_date,
            all_candidates: candidates[0].candidates,
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

electionRouter.get("/get-all-elections-names", async (req, res) => {
  try {
    var allElections = await Election.find(
      {
        is_completed: false,
      },
      { _id: 1, name: 1 }
    );
    if (!allElections || allElections.length <= 0) {
      res.json({
        message: "No elections available!",
        status: "404",
      });
    } else {
      res.json({
        message: "Elections found!",
        status: "200",
        allElections,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

electionRouter.put("/:id/announce-winner", async (req, res) => {
  const { id } = req.params;
  const { winnerId } = req.body;

  try {
    const election = await Election.findById(id);
    if (!election) {
      res.json({
        message: "Election not found!",
        status: "404",
      });
    }

    if (election.is_completed) {
      res.json({
        message: "Election is already completed",
        status: "400",
      });
    }

    var updatedData = {
      is_completed: true,
      winner: winnerId,
    };

    var filter = {
      _id: election._id,
    };

    var completedElection = await Election.findByIdAndUpdate(
      filter,
      updatedData,
      {
        new: true,
      }
    )
      .then((onElectionComplete) => {
        console.log("on election complete: ", onElectionComplete);

        res.json({
          message: "Election completed successfully",
          status: "200",
        });
        sendPushNotificationToElectionVoters(onElectionComplete._id, 'Election Completed!', onElectionComplete.name+' Election has completed!');
      })
      .catch((onElectionCompleteError) => {
        console.log("on election complete error: ", onElectionCompleteError);
        res.json({
          message: "Something went wrong while announcing the winner!",
          status: "400",
          error: onElectionCompleteError,
        });
      });
  } catch (error) {
    console.error("Error completing election:", error);
    res.json({ error: "An error occurred while completing the election" });
  }
});

module.exports = electionRouter;
