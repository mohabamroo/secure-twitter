import http4xx from "http-errors";
import User from "../../database/models/user";
import FollowRequest from "../../database/models/follow_request";

export const checkPublicUser = userID => {
  return new Promise(function(resolve, reject) {
    User.findOne({ _id: userID, private: false })
      .then(user => {
        if (user) {
          resolve(true);
        } else {
          reject(http4xx(404, "User not found or not public account."));
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const checkPublicUserPromise = userID => {
  return new Promise(function(resolve, reject) {
    User.findOne({ _id: userID, private: false })
      .then(user => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// checks if a given user account is public or followed by the current user
export const checkPublicOrFollowed = (req, res, next) => {
  const userID = req.params.user_id;
  return new Promise(function(resolve, reject) {
    checkPublicUser(userID)
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        FollowRequest.findOne({
          followerId: req.currentUser._id,
          followedId: userID,
          approved: true
        })
          .then(followObj => {
            if (followObj) {
              resolve(true);
            } else {
              reject(err);
            }
          })
          .catch(err2 => {
            reject(err2);
          });
      });
  });
};

export const checkPublicOrFollowedPipe = (req, res, next) => {
  checkPublicOrFollowed(req, res, next)
    .then(() => {
      next();
    })
    .catch(err => {
      next(err);
    });
};
