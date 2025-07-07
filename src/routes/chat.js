const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const express = require("express");
const User = require("../models/user");

const chatRouter = express.Router();


chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save(); // ✅ Save empty chat to ensure it exists
    }

    res.json(chat);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat", error: err.message });
  }
});


//API to get the name of target user
chatRouter.get("/user/:userId", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("firstName lastName");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = chatRouter;
