const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

// Utility to generate a unique, consistent room ID for any two users
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
    credentials: true // ✅ allow cookies/session to be sent
  }
});

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // ✅ Join a private chat room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`${firstName} joined Room: ${roomId}`);
    });

    // ✅ Leave a room when switching to a new chat
    socket.on("leaveChat", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left Room: ${roomId}`);
    });

    // ✅ Handle sending messages
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        // Find or create the chat document between both users
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        // Save message to DB
        const newMessage = {
          senderId: userId,
          text,
        };
        chat.messages.push(newMessage);
        await chat.save();

        // Emit the message to users in the same room
        io.to(roomId).emit("messageReceived", {
  firstName,
  lastName,
  text,
  senderId: userId,
  receiverId: targetUserId,
  time: new Date().toISOString(),
});



        console.log(`${firstName} sent message to Room ${roomId}`);
      } catch (err) {
        console.error("Error saving or sending message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
