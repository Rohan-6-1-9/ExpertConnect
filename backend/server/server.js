require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socketManager");

const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──
connectDB();

// ── Create HTTP server (required for Socket.io) ──
const server = http.createServer(app);

// ── Initialize Socket.io ──
initSocket(server);

// ── Start Listening ──
server.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  console.log(`🌐 API Base: http://localhost:${PORT}\n`);
});

// ── Unhandled Rejection Safeguard ──
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});