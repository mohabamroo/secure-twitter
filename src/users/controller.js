import User from "../../database/models/user";
import FollowRequest from "../../database/models/follow_request";
import validate from "../../config/express-validation";
import validation from "./validation";
import http4xx from "http-errors";
import { aclUtil, authUtil } from "../utilities";

const validateFollowedUser = (req, res, next) => {
  User.findById(req.params.user_id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next(http4xx(404, "User not found"));
      }
    })
    .catch(err => {
      next(err);
    });
};

const createFollowRequest = (req, res, next) => {
  const followObj = {
    followerId: req.currentUser._id,
    followedId: req.user._id
  };
  FollowRequest.findOneAndUpdate(
    followObj,
    { ...followObj, approved: !req.user.private },
    { new: 1, upsert: 1 }
  )
    .then(followRes => {
      req.followRes = followRes;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const removeFollowRequest = (req, res, next) => {
  const followObj = {
    followerId: req.currentUser._id,
    followedId: req.params.user_id
  };
  FollowRequest.findOneAndRemove(followObj)
    .then(followRes => {
      req.followRes = followRes;
      next();
    })
    .catch(err => {
      next(err);
    });
};

export default {
  followUserPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.emptyBody),
    validateFollowedUser,
    createFollowRequest
  ],
  unfollowUserPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.emptyBody),
    removeFollowRequest
  ]
};
