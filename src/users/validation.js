import Joi from "joi";

export default {
  emptyBody: {
    query: {},
    body: {}
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
  },
  editProfile: {
    body: {
      user: Joi.object({
        private: Joi.boolean(),
        name: Joi.string().allow(null),
        country: Joi.string().allow(null),
        phoneNumber: Joi.string().allow(null),
        address: Joi.string().allow(null)
      }).required()
    }
  }
};
