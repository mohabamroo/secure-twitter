import controller from "./controller";
import express from "express";

const router = express.Router();

router.post(
  "/follow/:user_id([a-z0-9]+)",
  controller.followUserPipeline,
  (req, res) => {
    res.status(201).json({
      message: "Followed User"
    });
  }
);

router.delete(
  "/unfollow/:user_id([a-z0-9]+)",
  controller.unfollowUserPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Unfollowed user"
    });
  }
);

export default router;
