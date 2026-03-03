const express = require("express");
const auth = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

const {
  listPublic,
  createIssue,
  getOne,
  voteIssue,
  addComment,
  listComments,
  resolveIssue,
} = require("../controllers/issues.controller");

const router = express.Router();

// 🔓 Public
router.get("/issues", listPublic);
router.get("/issues/:id", getOne);

// 🔐 Authenticated users
router.post("/issues", auth, createIssue);
router.post("/issues/:id/vote", auth, voteIssue);

// Comments
router.post("/issues/:id/comments", auth, addComment);
router.get("/issues/:id/comments", listComments);

// 👑 Admin only
router.patch("/issues/:id/resolve", auth, isAdmin, resolveIssue);

module.exports = router;
