const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const User = require("../models/User");

const router = express.Router();

const schema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  setupKey: z.string().min(1),
});

router.post("/admin/setup", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
  }

  const { username, password, setupKey } = parsed.data;

  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({ message: "Setup key invalide" });
  }

  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: "Username déjà utilisé" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
    role: "admin",
  });

  return res.status(201).json({ message: "Admin créé", id: user._id, username: user.username });
});

module.exports = router;
