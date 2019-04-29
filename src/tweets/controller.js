import Tweet from "../../database/models/tweet";
import validate from "../../config/express-validation";
import validation from "./validation";
import http4xx from "http-errors";
import { aclUtil, authUtil, privacyUtil } from "../utilities";

const createTweet = (req, res, next) => {
  const tweetObj = new Tweet(req.body.tweet);
  tweetObj.userId = req.currentUser._id;
  tweetObj.text = req.sanitize(tweetObj.text);
  Tweet.create(tweetObj)
    .then(function(tweet) {
      req.tweet = tweet;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

const listUserTweets = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  var options = {
    populate: [
      {
        path: "userId",
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
  Tweet.paginate({ userId: req.params.user_id }, options)
    .then(tweets => {
      req.tweets = tweets;
      next();
      return;
    })
    .catch(err => {
      next(err);
    });
};

export default {
  postTweetPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.postTweet),
    createTweet
  ],
  fetchUserTweetsPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.listTweetPage),
    privacyUtil.checkPublicOrFollowedPipe,
    listUserTweets
  ]
};
