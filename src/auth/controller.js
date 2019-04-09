import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/models/user";
import validate from "../../config/express-validation";
import validation from "./validation";
import http4xx from "http-errors";
import uuidv4 from "uuid/v4";

const userSignup = (req, res, next) => {
  const user = new User(req.body.user);
  const refreshToken = uuidv4();
  user.role = "user";
  user.refreshToken = refreshToken;
  User.create(user)
    .then(function(user) {
      req.user = user;
      next();
    })
    .catch(function(err) {
      next(err);
    });
};

const verifyCredentials = (req, res, next) => {
  const { email, password } = req.body.user;
  const roles = req.query.roles || ["user"];

  User.findOne({ email })
    .then(auth => {
      if (!auth) {
        next(http4xx(401, "Authentication Failed: Email does not exist."));
        return;
      }
      if (!roles.includes(auth["role"])) {
        next(http4xx(401, "Authentication Failed: Invalid role."));
        return;
      }
      bcrypt.compare(password, auth.get("password"), function(err, result) {
        if (err) {
          next(err);
          return;
        }
        if (!result) {
          next(http4xx(401, "Authentication Failed: Incorrect password."));
          return;
        }
        req.user = auth;
        next();
      });
    })
    .catch(err => {
      next(err);
    });
};

const generateJWT = (req, res, next) => {
  req.user = req.user.toJSON();
  delete req.user.password;
  req.token = jwt.sign(req.user, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24
  });
  next();
};

const refreshAuthToken = (req, res, next) => {
  const { refreshToken, email } = req.body;
  Auth.findOne({ refreshToken, email })
    .then(user => {
      if (!user) {
        next(http4xx(401, "Invalid refresh token for this user."));
      } else {
        user = user.toJSON();
        delete user.password;
        req.token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        next();
      }
    })
    .catch(err => {
      next(err);
    });
};

const initializeMongoModel = model => {
  if (model === "user") {
    return User;
  } else if (model === "doctor") {
    return Doctor;
  } else {
    return null;
  }
};

const updateUser = (req, res, next) => {
  const { id } = req.params;
  const MongoModel = initializeMongoModel(req.params.model);
  if (!MongoModel) {
    next(http4xx(400, "Invalid Model."));
    return;
  }
  MongoModel.findOneAndUpdate(
    { _id: id },
    { phoneVerified: true },
    { new: true }
  )
    .then(() => {
      next();
    })
    .catch(err => {
      next(err);
    });
};

export default {
  signUpUserPipeline: [validate(validation.userSignup), userSignup],
  signInPipeline: [validate(validation.signin), verifyCredentials, generateJWT],
  refreshTokenPipeline: [validate(validation.refreshToken), refreshAuthToken]
};
