import Tweet from "../../database/models/tweet";
import validate from "../../config/express-validation";
import validation from "./validation";
import http4xx from "http-errors";
import { aclUtil, authUtil, privacyUtil } from "../utilities";
import TweetReaction from "../../database/models/tweet_react";
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

const getTweet = (req, res, next) => {
  Tweet.findById(req.params.tweet_id)
    .then(tweet => {
      if (tweet) {
        console.log("TCL: getTweet -> tweet", tweet);
        req.params.user_id = tweet.get("userId");
        next();
      } else {
        next(http4xx(404, "Tweet not found"));
      }
    })
    .catch(err => {
      next(err);
    });
};

const reactTweet = action => {
  return (req, res, next) => {
    const tweetReactionObj = {
      tweetId: req.params.tweet_id,
      userId: req.currentUser._id,
      type: action
    };
    TweetReaction.findOneAndUpdate(tweetReactionObj, tweetReactionObj, {
      new: 1,
      upsert: 1
    })
      .then(update => {
        next();
      })
      .catch(err => {
        next(err);
      });
  };
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
  ],
  likeTweetPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    getTweet,
    privacyUtil.checkPublicOrFollowedPipe,
    reactTweet("like")
  ],
  retweetTweetPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    getTweet,
    privacyUtil.checkPublicOrFollowedPipe,
    reactTweet("like")
  ]
};
