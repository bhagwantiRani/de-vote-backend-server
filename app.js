const express = require("express");
const app = express();
const mongoose = require("mongoose");
var session = require("express-session");

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

app.use(
  session({
    secret: "lpWuPrFHWw7ye6VtNfLS",
    saveUninitialized: false,
    resave: false,
  })
);

const authRoutes = require("./routes/Auth");
const electionRoutes = require("./routes/Election");
const voterRoutes = require("./routes/Voter");
const candidateRoutes = require("./routes/Candidate");
const adminRoutes = require("./routes/Admin");
const emailRoutes = require("./routes/Email");
const forgotPasswordRoutes = require("./routes/ForgotPassword");
const notificationRoutes = require("./routes/Notification");

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/election", electionRoutes);
app.use("/api/voter", voterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/notification", notificationRoutes);


var port = process.env.PORT||5000;


app.listen(port, (err) => {
  if (err) {
    console.log("Error in running server: ", err);
  } else {
    console.log("De-Vote API is running . . .");

    mongoose.set("strictQuery", false);
    mongoose.connect(
      "mongodb+srv://hanzala:hanzala1.@cluster0.x1qno8i.mongodb.net/devoteDB",
      (err) => {
        if (err) {
          console.log("Error Occurred In Database Connection:  ", err);
        } else {
          console.log("De-Vote Database Connected!");
        }
      }
    );
  }
});
