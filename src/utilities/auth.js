import jwt from "jsonwebtoken";
import http4xx from "http-errors";

export const ensureAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(http4xx(401, err.name));
      } else {
        req.currentUser = decoded;
        req.access_token = token;
        next();
      }
    });
  } else {
    next(http4xx(401, "Missing Token"));
  }
};
