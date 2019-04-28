import http4xx from "http-errors";
import User from "../../database/models/user";
import FollowRequest from "../../database/models/follow_request";

const checkPublicUser = userID => {
  return new Promise(function(resolve, reject) {
    User.findOne({ _id: userID, private: false })
      .then(user => {
        if (user) {
          resolve();
        } else {
          reject(http4xx(404, "User not found or not public account."));
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
  checkPublicUser(userID)
    .then(() => {
      next();
    })
    .catch(err => {
      FollowRequest.findOne({
        followerId: req.currentUser._id,
        followedId: userID,
        approved: true
      })
        .then(followObj => {
          if (followObj) {
            next();
          } else {
            next(err);
          }
        })
        .catch(err2 => {
          next(err2);
        });
    });
};
