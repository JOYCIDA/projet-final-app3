const rateLimit = require("express-rate-limit");

// Limite simple pour register/login (anti brute force)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 requêtes / 10 min / IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives. Réessaie plus tard." },
});

module.exports = { authLimiter };
