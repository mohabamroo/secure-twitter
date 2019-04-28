import jwt from "jsonwebtoken";
import http4xx from "http-errors";
import Blacklist from "../../database/models/blacklist_tokens";
const checkBlacklist = (req, res, next) => {
  Blacklist.findOne({
    userID: req.currentUser._id,
    token: req.access_token
  })
    .then(record => {
      if (record) {
        next(http4xx(400, "This token was invalidated"));
      } else {
        console.log("alashn");
        next();
      }
    })
    .catch(err => next(err));
};

export const ensureAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(http4xx(401, err.name));
      } else {
        req.currentUser = decoded;
        req.access_token = token;
        checkBlacklist(req, res, next);
        // next();
      }
    });
  } else {
    next(http4xx(401, "Missing Token"));
  }
};
