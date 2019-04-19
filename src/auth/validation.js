import Joi from "joi";

export default {
  userSignup: {
    body: {
      user: Joi.object({
        email: Joi.string()
          .email({
            minDomainAtoms: 2
          })
          .required(),
        password: Joi.string()
          .min(8)
          .required(),
        name: Joi.string().required(),
        country: Joi.string(),
        phoneNumber: Joi.string()
          .regex(/^[0-9]*$/, "Phone Number")
          .allow(null),
        gender: Joi.string().valid(["male", "female"]),
        birthDate: Joi.date().allow(null),
        private: Joi.bool().default(false)
      }).required()
    }
  },
  signin: {
    body: {
      user: Joi.object({
        email: Joi.string()
          .email({
            minDomainAtoms: 2
          })
          .required(),
        password: Joi.string()
          .min(8)
          .required()
      }).required()
    }
  },
  refreshToken: {
    body: {
      refreshToken: Joi.string()
        .guid()
        .required(),
      email: Joi.string()
        .email({
          minDomainAtoms: 2
        })
        .required()
    }
  }
};
