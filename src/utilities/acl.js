import http4xx from "http-errors";

export const checkRole = roles => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      next(http4xx(403, "You are not authorized to access this endpoint."));
    } else {
      next();
    }
  };
};
