const express = require("express");
const router = express.Router();

const {
  getAllAdminNotificationTokens,
  getAllCandidateNotificationTokens,
  getAllVoterNotificationTokens,
  getVotersOfAElection,
  saveAdminNotificationToken,
  saveCandidateNotificationToken,
  saveVoterNotificationToken,
} = require("../controllers/Notifications");

router.get("/get-all-admin-notification-tokens", getAllAdminNotificationTokens);
router.get(
  "/get-all-candidate-notification-tokens",
  getAllCandidateNotificationTokens
);
router.get("/get-all-voter-notification-tokens", getAllVoterNotificationTokens);
router.get(
  "/get-voters-notification-tokens-of-a-election/:election_id",
  getVotersOfAElection
);

router.post(
  "/save-admin-notification-token/:admin_id",
  saveAdminNotificationToken
);
router.post(
  "/save-candidate-notification-token/:admin_id",
  saveCandidateNotificationToken
);
router.post(
  "/save-voter-notification-token/:voter_id",
  saveVoterNotificationToken
);

module.exports = router;
