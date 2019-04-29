import controller from "./controller";
import express from "express";

const router = express.Router();

router.post("/:user_id", controller.sendMessagePipeline, (req, res) => {
  res.status(201).json({
    message: "Sent message.",
    messageObj: req.message
  });
});

router.get("/chats", controller.fetchUserChatsPipleline, (req, res) => {
  res.status(200).json({
    message: "Fetched chats",
    ...req.messages
  });
});

router.get(
  "/:user_id",
  controller.fetchMessagesWithUserPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Fetched messages",
      ...req.messages
    });
  }
);

export default router;
