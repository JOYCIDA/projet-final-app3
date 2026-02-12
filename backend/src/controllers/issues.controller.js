const { z } = require("zod");
const Issue = require("../models/Issue");

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

  const issues = await Issue.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .select("-__v");

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

  res.status(201).json(issue);
}

async function getOne(req, res) {
  const issue = await Issue.findById(req.params.id).select("-__v");
  if (!issue) return res.status(404).json({ message: "Issue introuvable" });
  res.json(issue);
}

module.exports = { listPublic, createIssue, getOne };
