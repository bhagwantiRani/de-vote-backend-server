const express = require("express");
const candidateRouter = express.Router();

const Candidate = require("../models/Candidate");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary").v2;

candidateRouter.get("/get-all-candidates", async (req, res) => {
  try {
    var allCandidates = await Candidate.find();
    if (allCandidates && allCandidates.length >= 0) {
      res.status(200).json({
        status: "200",
        message: "Candidates Found!",
        allCandidates: allCandidates,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "No Candidates Found",
        allCandidates: allCandidates,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
});

candidateRouter.get("/get-candidate/:id", async (req, res) => {
  try {
    var _id = req.params.id;
    console.log(_id);
    if (_id !== undefined && _id != null) {
      var candidates = await Candidate.find({ _id: _id });
    } else {
      var candidates = await Candidate.find();
    }
    if (!candidates.length <= 0) {
      res.json({
        status: "200",
        candidates: candidates,
        message: "Candidate found with given id",
      });
    } else {
      res.json({
        status: "404",
        message: "Candidate not found with given id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "internal server error",
    });
  }
});

candidateRouter.post("/add-candidate", async (req, res) => {
  try {
    var { first_name, last_name, email_address, password, phone_no } = req.body;
    var data = {
      first_name,
      last_name,
      email_address,
      password,
      phone_no,
    };

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const previousCandidate = await Candidate.findOne().sort({ timestamp: -1 });
    const previousHash =
      previousCandidate == null ? "" : previousCandidate.hash;
    const timestamp = new Date();
    var newGeneratedHash = crypto
      .createHash("sha256")
      .update(previousHash + JSON.stringify(data) + timestamp)
      .digest("hex");

    const newCandidate = new Candidate({
      first_name: first_name,
      last_name: last_name,
      password: hashedPassword,
      email_address: email_address,
      phone_no: phone_no,
      previous_hash: previousHash,
      time_stamp: timestamp,
      hash: newGeneratedHash,
    });

    var savedCandidate = await newCandidate.save();
    
    res.status(200).json({
      status: "200",
      message: "New Candidate Registered!",
      savedCandidate: savedCandidate,
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

candidateRouter.delete("/delete-candidate/:id", async (req, res) => {
  try {
    var candidateId = req.params.id;
    var filter = { _id: candidateId };

    var searchedCandidate = await Candidate.findOneAndDelete(filter, {
      rawResult: true,
    })
      .then(function (result) {
        if (result.value === null) {
          res.status(404).json({
            status: "404",
            message: "No candidate found with given id",
          });
        } else {
          if (result.lastErrorObject.n >= 1) {
            res.status(200).json({
              status: "200",
              message: "Candidate deleted successfully",
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

candidateRouter.put("/update-candidate/:id", async (req, res) => {
  try {
    var { email_address, first_name, last_name, phone_no } = req.body;

    var filter = { _id: req.params.id };
    var update = {
      first_name: first_name,
      last_name: last_name,
      email_address: email_address,
      phone_no: phone_no,
    };

    var searchedCandidate = await Candidate.findByIdAndUpdate(filter, update, {
      new: true,
      rawResult: true,
    })
      .then(function (result) {
        console.log(result.value);
        if (result.value === null) {
          var responseData = {
            status: "404",
            message: "No candidate found with given id",
          };
          res.status(404).json(responseData);
        } else {
          if (result.lastErrorObject.updatedExisting === true) {
            var responseData = {
              status: "200",
              message: "Candidate updated successfully!",
              updatedDocument: result.value,
            };
            res.status(200).json(responseData);
          } else {
            var responseData = {
              status: "202",
              message: "Candidate data not updated yet!",
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

candidateRouter.post("/upload-symbol-image/:id", async (req, res) => {
  try {
    var candidateId = req.params.id;
    var { image_url } = req.body;

    var candidate = await Candidate.findById({
      _id: candidateId,
    });

    if (!candidate) {
      res.json({
        message: "No candidate found with provided id!",
        status: "404",
      });
    } else {
      cloudinary.config({
        cloud_name: "dkyhupbvz",
        api_key: "469299171767965",
        api_secret: "zQBBtOCcNPSkU6BoNWvs_FUWsDY",
      });

      cloudinary.uploader
        .upload(image_url)
        .then(async (result) => {
          console.log("Secure url: ", result.secure_url, result);

          var filter = {
            _id: candidateId,
          };

          var updateData = {
            symbol_image: {
              image: result.secure_url,
              public_id: result.public_id,
            },
          };

          var updatedCandidate = await Candidate.findByIdAndUpdate(
            filter,
            updateData,
            {
              new: true,
            }
          )
            .then((updatedCandidateResult) => {
              res.json({
                message: "Symbol image uploaded!",
                status: "200",
                updatedCandidateResult,
              });
            })

            .catch((error) => {
              console.log("Database error: ", error);
              res.json({
                message:
                  "Something went wrong while saving symbol image to database!",
                status: "400",
                error,
              });
            });
        })

        .catch((error) => {
          console.log("Cloudinary error: ", error);
          res.json({
            message:
              "Something went wrong while uploading symbol image to cloud!",
            status: "400",
            error,
          });
        });
    }
  } catch (error) {
    res.json({
      error: error,
      status: "500",
      message: "Internal server error!",
    });
  }
});

candidateRouter.delete("/delete-symbol-image/:id", async (req, res) => {
  try {
    var candidateId = req.params.id;

    var searchedCandidate = await Candidate.findById({
      _id: candidateId,
    });

    if (!searchedCandidate) {
      res.json({
        message: "No candidate found with provided id!",
        status: "404",
      });
    }
    console.log(
      "Public id: ",
      searchedCandidate.symbol_image.public_id,
      searchedCandidate.symbol_image
    );

    cloudinary.config({
      cloud_name: "dkyhupbvz",
      api_key: "469299171767965",
      api_secret: "zQBBtOCcNPSkU6BoNWvs_FUWsDY",
    });

    cloudinary.uploader
      .destroy(searchedCandidate.symbol_image.public_id)
      .then(async (result) => {
        console.log("Cloudinary delete result: ", result);

        var filter = {
          _id: candidateId,
        };

        var update = {
          symbol_image: {
            image: "",
            public_id: "",
          },
        };
        var candidate = await Candidate.findByIdAndUpdate(filter, update, {
          new: true,
        })
          .then((resultCandidate) => {
            console.log("Database success: ", resultCandidate);
            res.json({
              message: "Symbol image deleted!",
              status: "200",
              resultCandidate,
            });
          })
          .catch((error) => {
            console.log("Database error: ", error);
            res.json({
              message:
                "Something went wrong while deleting symbol image from database!",
              status: "400",
              error,
            });
          });
      })
      .catch((error) => {
        console.log("Cloudinary delete error: ", error);
        res.json({
          message: "Something went wrong while deleting image from cloud!",
          status: "400",
          error,
        });
      });
  } catch (error) {
    res.json({
      error: error,
      status: "500",
      message: "Internal server error!",
    });
  }
});

const { candidateResetPassword } = require("../controllers/ForgotPassword");

candidateRouter.post("/reset-password/:candidate_id", candidateResetPassword);

module.exports = candidateRouter;
