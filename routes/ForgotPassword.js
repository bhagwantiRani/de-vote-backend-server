const express = require("express");
const router = express.Router();

const {
  adminResetPassword,
  candidateResetPassword,
  voterResetPassword,
  findAdmin,
  findCandidate,
  findVoter,
} = require("../controllers/ForgotPassword");

router.post("/find-admin", findAdmin);
router.post("/find-candidate", findCandidate);
router.post("/find-voter", findVoter);

router.put("/change-admin-password/:admin_id", adminResetPassword);

router.put("/change-candidate-password/:candidate_id", candidateResetPassword);

router.put("/change-voter-password/:voter_id", voterResetPassword);

module.exports = router;
