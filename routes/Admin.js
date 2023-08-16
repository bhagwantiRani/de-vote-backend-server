const express = require("express");
const authRouter = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");

authRouter.post("/login", async (req, res) => {
  try {
    var { email_address, password } = req.body;
    var admin = await Admin.findOne({
      email_address: email_address,
    })
      .then(async (onAdminFound) => {
        console.log(onAdminFound);
        const passwordMatch = await bcrypt.compare(
          password,
          onAdminFound?.password
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
            email_address: onAdminFound.email_address,
            admin: onAdminFound,
          };
          res.json(responseData);
        }
      })
      .catch((onAdminFoundError) => {
        console.log("on admin found error: ", onAdminFoundError);
        var responseData = {
          message:
            "Invalid email address or password! No admin found for given email address and password.",
          status: "404",
        };

        res.status(404).json(responseData);
      });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

authRouter.post("/sign-up", async (req, res) => {
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

    const previousAdmin = await Admin.findOne().sort({ timestamp: -1 });
    const previousHash = previousAdmin ? previousAdmin.hash : "";
    const timestamp = new Date();
    var newGeneratedHash = crypto
      .createHash("sha256")
      .update(previousHash + JSON.stringify(data) + timestamp)
      .digest("hex");
    const newAdmin = new Admin({
      first_name: first_name,
      last_name: last_name,
      password: hashedPassword,
      email_address: email_address,
      phone_no: phone_no,
      previous_hash: previousHash,
      time_stamp: timestamp,
      hash: newGeneratedHash,
    });
    var savedAdmin = await newAdmin.save();
    res.status(200).json({
      status: "200",
      message: "New Admin Registered!",
      savedAdmin: savedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      error: error,
    });
  }
});

const { adminResetPassword } = require("../controllers/ForgotPassword");
const { saveAdminNotificationToken } = require("../controllers/Notifications");

authRouter.post("/reset-password/:admin_id", adminResetPassword);

authRouter.patch(
  "/save-notification-token/:admin_id",
  saveAdminNotificationToken
);

module.exports = authRouter;
