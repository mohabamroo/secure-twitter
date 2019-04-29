import Joi from "joi";

export default {
  createMessage: {
    body: {
      message: Joi.object({
        text: Joi.string()
          .required()
          .max(280)
      }).required()
    }
  },
  listMessagesPage: {
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
