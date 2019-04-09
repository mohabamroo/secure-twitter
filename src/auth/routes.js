import controller from "./controller";
import express from "express";

const router = express.Router();

router.post("/register", controller.signUpUserPipeline, (req, res) => {
  res.status(201).json({
    message: "User successfully created",
    user: req.user
  });
});

router.post("/login", controller.signInPipeline, (req, res) => {
  res.status(200).json({
    message: "Successfully signed in",
    token: req.token,
    refreshToken: req.user.refreshToken,
    email: req.user.email,
    role: req.user.role
  });
});

router.post("/refresh", controller.refreshTokenPipeline, (req, res) => {
  res.status(200).json({
    message: "Successfully refreshed your token",
    token: req.token
  });
});
export default router;
