import controller from "./controller";
import express from "express";

const router = express.Router();

router.post("/", controller.postTweetPipeline, (req, res) => {
  res.status(201).json({
    message: "Created Tweet.",
    tweet: req.tweet
  });
});

router.get(
  "/users/:user_id([a-z0-9]+)",
  controller.fetchUserTweetsPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Fetched tweets",
      ...req.tweets
    });
  }
);

router.post("/like/:tweet_id", controller.likeTweetPipeline, (req, res) => {
  res.status(200).json({
    message: "Liked Tweet."
  });
});

router.post(
  "/retweet/:tweet_id",
  controller.retweetTweetPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Retweeted Tweet."
    });
  }
);

export default router;
