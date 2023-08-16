const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "",
  },
  start_date: {
    type: Date,
    required: false,
  },
  end_date: {
    type: Date,
    required: false,
  },
  candidates: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates",
      },
    ],
    required: false,
    default: [],
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidates",
    required: false,
    default: null,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
});

// electionSchema.methods.completeElection = function (winnerId) {
//   this.winner = winnerId;
//   this.is_completed = true;
//   return this.save();
// };

module.exports = mongoose.model("elections", electionSchema);
