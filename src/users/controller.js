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

const unfollowUser = (req, res, next) => {
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

const acceptFollowRequest = (req, res, next) => {
  FollowRequest.findByIdAndUpdate(
    {
      followedId: req.currentUser._id,
      _id: req.params.follow_request_id
    },
    { approved: true },
    { new: true }
  )
    .then(followRes => {
      if (!followRes) {
        next(http4xx(400, "Follow request not updated or found"));
        return;
      }
      req.followRes = followRes;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const removeFollowRequest = (req, res, next) => {
  FollowRequest.findByIdAndDelete({
    followedId: req.currentUser._id,
    _id: req.params.follow_request_id
  })
    .then(followRes => {
      req.followRes = followRes;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const listUsers = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  var options = {
    limit: limit,
    page: page,
    select: ["-refreshToken", "-role"]
  };
  User.paginate({}, options)
    .then(users => {
      req.users = users;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const listFollowingUsers = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  var options = {
    populate: [
      {
        path: "followedId",
        select: {
          name: 1,
          email: 1,
          gender: 1,
          country: 1,
          _id: 1,
          birthDate: 1,
          private: 1
        }
      }
    ],
    limit: limit,
    page: page
  };
  FollowRequest.paginate({ followerId: req.currentUser._id }, options)
    .then(followRes => {
      console.log("TCL: listFollowingUsers -> followRes", followRes);
      req.following = followRes.docs.map(x => x.followedId);
      next();
    })
    .catch(err => {
      next(err);
    });
};

const listFollowerUsers = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  var options = {
    populate: [
      {
        path: "followerId",
        select: {
          name: 1,
          email: 1,
          gender: 1,
          country: 1,
          _id: 1,
          birthDate: 1,
          private: 1
        }
      }
    ],
    limit: limit,
    page: page
  };
  FollowRequest.paginate({ followedId: req.currentUser._id }, options)
    .then(followRes => {
      console.log("TCL: listFollowingUsers -> followRes", followRes);
      req.followers = followRes.docs.map(x => x.followerId);
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
    unfollowUser
  ],
  acceptFollowRequestPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.emptyBody),
    acceptFollowRequest
  ],
  removeFollowRequestPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.emptyBody),
    removeFollowRequest
  ],
  listUsersPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    listUsers
  ],
  listFollowedUsersPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    listFollowingUsers,
    listFollowerUsers
  ]
};
