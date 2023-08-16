const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
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

  symbol_image: {
    type: Object,
    required: false,
    default: {
      image: "",
      public_id: "",
    },
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: false,
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
  total_votes: {
    type: Number,
    required: false,
    default: 0,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "elections",
  },
});

module.exports = mongoose.model("candidates", candidateSchema);
