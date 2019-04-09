import Joi from "joi";

export default {
  postTweet: {
    body: {
      tweet: Joi.object({
        text: Joi.string()
          .required()
          .max(280)
      }).required()
    }
  },
  listTweetPage: {
    query: {
      page: Joi.number()
        .integer()
        .min(1)
        .default(1),
      pageSize: Joi.number()
        .integer()
        .min(1)
        .default(10),
      search: Joi.string().default("")
    }
  }
};
