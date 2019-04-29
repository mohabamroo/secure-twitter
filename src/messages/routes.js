import controller from "./controller";
import express from "express";

const router = express.Router();

router.post(
  "/:user_id([a-z0-9]+)",
  controller.sendMessagePipeline,
  (req, res) => {
    res.status(201).json({
      message: "Sent message.",
      messageObj: req.message
    });
  }
);

router.get("/chats", controller.fetchUserChatsPipleline, (req, res) => {
  res.status(200).json({
    message: "Fetched chats",
    ...req.messages
  });
});

router.get(
  "/:user_id([a-z0-9]+)",
  controller.fetchMessagesWithUserPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Fetched messages",
      ...req.messages
    });
  }
);

export default router;
