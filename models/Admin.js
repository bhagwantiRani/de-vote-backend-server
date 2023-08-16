const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  email_address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/6522/6522516.png",
  },
  notification_token: {
    type: String,
    required: false,
    default: "",
  },
  time_stamp: {
    type: Date,
    required: false,
    default: new Date(),
  },
  hash: {
    type: String,
    required: false,
    default: "",
  },
  previous_hash: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("admins", AdminSchema);
