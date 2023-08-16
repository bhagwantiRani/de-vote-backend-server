const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: "",
    ref: "voters",
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: "",
    ref: "candidates",
  },

  election: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: "",
    ref: "elections",
  },
  public_key: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: false,
    default: "",
  },
});

var voteModal = mongoose.model("votes", voteSchema);

module.exports = voteModal;
