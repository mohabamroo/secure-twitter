import controller from "./controller";
import express from "express";

const router = express.Router();

router.get("/", controller.listUsersPipeline, (req, res) => {
  res.status(200).json({
    message: "Fetched users",
    ...req.users
  });
});

router.patch("/profile", controller.updateProfilePipeline, (req, res) => {
  res.status(200).json({
    message: "Updated profile",
    profile: req.profile
  });
});

router.get("/following", controller.listFollowedUsersPipeline, (req, res) => {
  res.status(200).json({
    message: "Fetched users",
    following: req.following,
    followers: req.followers
  });
});

router.post(
  "/follow/:user_id([a-z0-9]+)",
  controller.followUserPipeline,
  (req, res) => {
    res.status(201).json({
      message: req.followRes.approved ? "Followed user" : "Follow request sent",
      followRes: req.followRes
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

router.patch(
  "/follow_request/:follow_request_id([a-z0-9]+)",
  controller.acceptFollowRequestPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Accepted request",
      followRes: req.followRes
    });
  }
);

router.delete(
  "/follow_request/:follow_request_id([a-z0-9]+)",
  controller.removeFollowRequestPipeline,
  (req, res) => {
    res.status(200).json({
      message: "Removed follow request"
    });
  }
);

export default router;
