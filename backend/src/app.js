const issuesRoutes = require("./routes/issues.routes");
const adminSetupRoutes = require("./routes/adminSetup.routes");
const userRoutes = require("./routes/user.routes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/", userRoutes);
app.use("/auth", authRoutes);
app.use("/", adminSetupRoutes);
app.use("/", issuesRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

module.exports = app;
