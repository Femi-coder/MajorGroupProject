const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins, or set your Vercel URL here
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    console.log("💬 Message received:", msg);
    io.emit("chatMessage", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`✅ Socket.IO server running on port ${PORT}`));
