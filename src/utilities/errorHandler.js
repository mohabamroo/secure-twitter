import expressValidation from "express-validation";
import http4xx from "http-errors";
import { logger } from "../../logger";

export default (err, req, res, next) => {
  if (err.name === "ValidationError") {
    handleMongodbError(err, res);
  } else if (err.name === "CastError") {
    handleNotFoundError(err, res);
  } else if (err instanceof expressValidation.ValidationError) {
    handleExpressValidationError(err, res);
  } else if (err instanceof http4xx.HttpError) {
    handleHttpErrors(err, res);
  } else {
    unhandledError(err, res);
  }
};

const handleMongodbError = (err, res) => {
  logger.error("Mongodb Error: ", err);
  res.status(400).json({
    err: "Bad Request",
    message: err
  });
};

const handleExpressValidationError = (err, res) => {
  logger.error("Express Validation Error: ");
  res.status(400).json({
    err: "Bad Request",
    message: "Validation Error",
    fields: err.errors
  });
};

const handleHttpErrors = (err, res) => {
  res.status(err.status).json({ err: err.name, message: err.message });
};

const unhandledError = (err, res) => {
  logger.error("Unhandled Error: ", err);
  res.status(500).json({
    err: "Internal Server Error",
    message: "Please refer to the api documentation"
  });
};

const handleNotFoundError = (err, res) => {
  // TODO: HOWTO handle cast error?
  logger.error("Cast Error: ", err);
  res.status(404).json({
    err: "Not found Error",
    message: "Model not found, invalid ID."
  });
};
