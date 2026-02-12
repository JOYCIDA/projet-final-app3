const express = require("express");
const auth = require("../middleware/auth.middleware");
const { listPublic, createIssue, getOne } = require("../controllers/issues.controller");

const router = express.Router();

// Public : liste + détail
router.get("/issues", listPublic);
router.get("/issues/:id", getOne);

// Auth : création
router.post("/issues", auth, createIssue);

module.exports = router;
