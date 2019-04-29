import controller from "./controller";
import express from "express";

const router = express.Router();

router.post("/", controller.postTweetPipeline, (req, res) => {
  res.status(201).json({
    message: "Created Tweet.",
    tweet: req.tweet
  });
});

router.get("/:user_id", controller.fetchUserTweetsPipeline, (req, res) => {
  res.status(200).json({
    message: "Fetched tweets",
    ...req.tweets
  });
});

export default router;
