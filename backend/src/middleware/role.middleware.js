function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès interdit (admin seulement)" });
  }
  next();
}

module.exports = isAdmin;
