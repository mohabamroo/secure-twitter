import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import routesV1 from "../routes.v1";
import mongooseConnect from "./utilities/mongoose";
import errorHandler from "./utilities/errorHandler";
import rateLimit from "express-rate-limit";

require("dotenv").config();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

const app = express();
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(morgan("dev"));
// only apply to requests that begin with /api/
app.use("/api/", apiLimiter);
routesV1(app, "/api");

app.use(errorHandler);

mongooseConnect();

export default app;
