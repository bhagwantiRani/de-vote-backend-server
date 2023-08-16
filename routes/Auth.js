const express = require("express");
const authRouter = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const Voter = require("../models/Voter");

authRouter.post("/login", async (req, res) => {
  try {
    const { email_address, password } = req.body;
    const voter = await Voter.findOne({ email_address })
      .then(async (onVoterFound) => {
        console.log("on voter found: ", onVoterFound);

        const passwordMatch = await bcrypt.compare(
          password,
          onVoterFound?.password
        );
        if (!passwordMatch) {
          res.status(401).json({
            message:
              "Invalid email address or password! Password does not match.",
            status: "401",
          });
        } else {
          const responseData = {
            status: "200",
            message: "Login Successful!",
            email_address: onVoterFound.email_address,
            voter: onVoterFound,
          };

          res.json(responseData);
        }
      })
      .catch((onVoterFoundError) => {
        console.log("on voter found error: ", onVoterFoundError);
        res.status(404).json({
          message:
            "Invalid email address or password! No voter found for the given email address.",
          status: "404",
        });
      });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
});

authRouter.post("/sign-up", async (req, res) => {
  try {
    const { first_name, last_name, email_address, password, phone_no } =
      req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const previousVoter = await Voter.findOne().sort({ timestamp: -1 });
    const previousHash = previousVoter ? previousVoter.hash : "";
    const timestamp = new Date();
    const newGeneratedHash = crypto
      .createHash("sha256")
      .update(previousHash + JSON.stringify(req.body) + timestamp)
      .digest("hex");

    const newVoter = new Voter({
      first_name,
      last_name,
      email_address,
      password: hashedPassword,
      phone_no,
      previous_hash: previousHash,
      timestamp,
      hash: newGeneratedHash,
    });

    const savedVoter = await newVoter.save();

    res.status(200).json({
      status: "200",
      message: "New Voter Registered!",
      savedVoter,
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = authRouter;
