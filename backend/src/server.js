require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`✅ API running: http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("❌ Start error:", e.message);
    process.exit(1);
  }
}

start();
