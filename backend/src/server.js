require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connecté :", socket.id);
    });

    // rendre io accessible dans toute l'app
    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`✅ API + WS running on http://localhost:${PORT}`);
    });

  } catch (e) {
    console.error("❌ Start error:", e.message);
    process.exit(1);
  }
}

start();
