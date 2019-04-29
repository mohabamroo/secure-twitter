import Message from "../../database/models/message";
import validate from "../../config/express-validation";
import validation from "./validation";
import http4xx from "http-errors";
import { aclUtil, authUtil, privacyUtil } from "../utilities";
import mongoose from "mongoose";
const userSelectFields = {
  name: 1,
  email: 1,
  gender: 1,
  country: 1,
  _id: 1,
  birthDate: 1,
  private: 1
};

const createMessage = (req, res, next) => {
  const messageObj = new Message(req.body.message);
  messageObj.receiverId = req.params.user_id;
  messageObj.senderId = req.currentUser._id;
  messageObj.request = !req.user_privacy_allowed;
  Message.create(messageObj)
    .then(message => {
      req.message = message;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const injectPrivacyFlag = (req, res, next) => {
  privacyUtil
    .checkPublicOrFollowed(req, res, next)
    .then(() => {
      req.user_privacy_allowed = true;
      next();
    })
    .catch(err => {
      req.user_privacy_allowed = false;
      next();
    });
};

const listUserMessages = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  var options = {
    populate: [
      {
        path: "receiverId",
        select: userSelectFields
      },
      {
        path: "senderId",
        select: userSelectFields
      }
    ],
    limit: limit,
    page: page
  };
  Message.paginate(
    {
      $or: [
        { senderId: req.currentUser._id, receiverId: req.params.user_id },
        { receiverId: req.currentUser._id, senderId: req.params.user_id }
      ]
    },
    options
  )
    .then(messages => {
      req.messages = messages;
      next();
    })
    .catch(err => {
      next(err);
    });
};

const listUserChats = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.pageSize || 10;
  // Fetching unique messages sent or recieved by this user
  Message.aggregate([
    {
      $match: {
        $or: [
          {
            senderId: { $eq: new mongoose.Types.ObjectId(req.currentUser._id) }
          },
          {
            receiverId: {
              $eq: new mongoose.Types.ObjectId(req.currentUser._id)
            }
          }
        ]
      }
    },
    { $group: { _id: "$senderId" } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ])
    .then(messages => {
      req.messages = messages;
      next();
    })
    .catch(err => {
      next(err);
    });
};

export default {
  sendMessagePipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.createMessage),
    injectPrivacyFlag,
    createMessage
  ],
  fetchMessagesWithUserPipeline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.listMessagesPage),
    listUserMessages
  ],
  fetchUserChatsPipleline: [
    authUtil.ensureAuthenticated,
    aclUtil.checkRole(["user"]),
    validate(validation.listMessagesPage),
    listUserChats
  ]
};
