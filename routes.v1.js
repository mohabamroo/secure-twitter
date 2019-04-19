import authRoutes from "./src/auth/routes";
import tweetRoutes from "./src/tweets/routes";
import userRoutes from "./src/users/routes";

export default (app, base) => {
  app.use(`${base}/auth`, authRoutes);
  app.use(`${base}/tweets`, tweetRoutes);
  app.use(`${base}/users`, userRoutes);
};
