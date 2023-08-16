const express = require("express");
const emailRouter = express.Router();
const crypto = require("crypto");
const keyGenerator = require("../utils/KeyGeneration");
const nodemailer = require("nodemailer");
const session = require("express-session");

const Voter = require("../models/Voter");

emailRouter.get("/get-otp-code/:email", async (req, res) => {
  try {
    var userEmail = req.params.email;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: "2525",
      auth: {
        user: "hanzalamalik056@gmail.com",
        pass: "ijkgqwdrptpmejte",
      },
    });

    var otp = Math.floor(Math.random() * 8999 + 1000);
    var mailOptions = {
      from: "DEVOTE-NO-REPLY hanzalamalik056@gmail.com",
      to: userEmail,
      subject: "OTP Verification",
      text: "Verify your email address",
      html: `<h1>${otp}</h1>`,
    };

    // verification for gmail service start

    // transporter.verify((error, success) => {
    //   if (error) {
    //     console.log(error);
    //     res.send(error.message);
    //   } else {
    //     console.log(success);
    //     res.send(success);
    //   }
    // });

    // verification for gmail service end

    // sending email here
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("Email sent: " + info.response);
        req.session.otp = otp;
        console.log(req.session.otp);
        res.status(200).json({
          transporterResponse: info.response,
          acceptedEmails: info.accepted,
          message: "OTP Sent Successfully!",
          status: "200",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

emailRouter.post("/verify-otp/:email", async (req, res) => {
  try {
    var sessionCode = req.session.otp;
    var bodyCode = req.body.code;
    var userEmail = req.params.email;

    if (sessionCode == bodyCode) {
      req.session.destroy();
      var filter = { email_address: userEmail };
      var update = {
        is_verified: true,
      };

      var searchedUser = await Voter.findOneAndUpdate(filter, update, {
        new: true,
        rawResult: true,
      })
        .then(function (result) {
          console.log(result.value);
          if (result.value === null) {
            var responseData = {
              status: "404",
              message: "No user found with provided id",
            };
            res.status(404).json(responseData);
          } else {
            if (result.lastErrorObject.updatedExisting === true) {
              res.status(200).json({
                message: "OTP Verified",
                status: "200",
                is_verified: result.value.is_verified,
                updatedUser: result.value,
              });
            } else {
              res.status(401).json({
                message: "OTP Not Verified",
                status: "401",
              });
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
    } else {
      res.status(401).json({
        message: "OTP Not Verified",
        status: "401",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "500",
      message: "Internal Server Error!",
    });
  }
});

module.exports = emailRouter;
