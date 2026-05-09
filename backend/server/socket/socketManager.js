let io;

/**
 * Initialize Socket.io with the HTTP server.
 * Called once in server.js.
 */
const initSocket = (httpServer) => {
  const { Server } = require("socket.io");

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ── Join expert-specific room to receive targeted updates ──
    // Client emits: socket.emit("join:expert", expertId)
    socket.on("join:expert", (expertId) => {
      if (expertId) {
        socket.join(`expert:${expertId}`);
        console.log(`   ↳ Socket ${socket.id} joined room expert:${expertId}`);
      }
    });

    // ── Leave expert room ──
    socket.on("leave:expert", (expertId) => {
      if (expertId) {
        socket.leave(`expert:${expertId}`);
        console.log(`   ↳ Socket ${socket.id} left room expert:${expertId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Returns the initialized io instance.
 * Use this in controllers to emit events.
 */
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  return io;
};

module.exports = { initSocket, getIO };