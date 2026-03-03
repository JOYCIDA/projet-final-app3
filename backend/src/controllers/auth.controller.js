const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
  }

  const { username, password } = parsed.data;

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(409).json({ message: "Username déjà utilisé" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
    role: "citizen",
  });

  return res.status(201).json({ message: "Utilisateur créé", id: user._id, username: user.username });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
  }

  const { username, password } = parsed.data;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ token });
}

module.exports = { register, login };
