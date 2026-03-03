const Comment = require("../models/Comment");
const { z } = require("zod");
const Issue = require("../models/Issue");
const Vote = require("../models/Vote");

const createSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(2000),
  category: z.enum(["road", "lighting", "waste", "water", "other"]).optional(),
  location: z.object({
    address: z.string().max(120).optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

async function listPublic(req, res) {
  const { status, q, category } = req.query;

  const filter = {};
  if (status === "open" || status === "resolved") filter.status = status;
  if (category) filter.category = category;

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { "location.address": { $regex: q, $options: "i" } },
    ];
  }

  const issues = await Issue.find(filter).sort({ createdAt: -1 }).limit(200).select("-__v");
  res.json(issues);
}

async function createIssue(req, res) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
  }

  const issue = await Issue.create({
    ...parsed.data,
    createdBy: req.user.id,
  });

  // 🔥 WebSocket broadcast
  const io = req.app.get("io");
  io.emit("issue:new", issue);

  res.status(201).json(issue);
}


async function getOne(req, res) {
  const issue = await Issue.findById(req.params.id).select("-__v");
  if (!issue) return res.status(404).json({ message: "Issue introuvable" });
  res.json(issue);
}

async function voteIssue(req, res) {
  const issueId = req.params.id;

  try {
    await Vote.create({
      issue: issueId,
      user: req.user.id,
    });

    await Issue.findByIdAndUpdate(issueId, { $inc: { votesCount: 1 } });
    res.json({ message: "Vote enregistré" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Vous avez déjà voté pour cette issue" });
    }
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addComment(req, res) {
  const issueId = req.params.id;

  const issue = await Issue.findById(issueId);
  if (!issue) return res.status(404).json({ message: "Issue introuvable" });

  const { content } = req.body;
  if (!content || content.length < 2) {
    return res.status(400).json({ message: "Commentaire invalide" });
  }

  const comment = await Comment.create({
    issue: issueId,
    user: req.user.id,
    content,
  });

  res.status(201).json(comment);
}

async function listComments(req, res) {
  const issueId = req.params.id;

  const comments = await Comment.find({ issue: issueId })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  res.json(comments);
}


// ✅ Admin only
async function resolveIssue(req, res) {
  const issueId = req.params.id;

  const issue = await Issue.findById(issueId);
  if (!issue) return res.status(404).json({ message: "Issue introuvable" });

  issue.status = "resolved";
  await issue.save();

  res.json({ message: "Issue marquée comme résolue" });
}

module.exports = {
  listPublic,
  createIssue,
  getOne,
  voteIssue,
  resolveIssue,
  addComment,
  listComments,
};

