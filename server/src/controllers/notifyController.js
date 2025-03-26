// controllers/notifyController.js
const pusher = require("../config/pusher");

const sendBroadcast = async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: "Title and message are required." });
  }

  try {
    await pusher.trigger("event-channel", "new-notification", {
      title,
      message,
    });

    res.status(200).json({ success: true, message: "Notification sent." });
  } catch (error) {
    console.error("❌ Pusher error:", error);
    res.status(500).json({ message: "Failed to send notification", error });
  }
};

module.exports = { sendBroadcast };
