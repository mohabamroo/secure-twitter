import authRoutes from "./src/auth/routes";
import tweetRoutes from "./src/tweets/routes";
import userRoutes from "./src/users/routes";
import messageRoutes from "./src/messages/routes";

export default (app, base) => {
  app.use(`${base}/auth`, authRoutes);
  app.use(`${base}/tweets`, tweetRoutes);
  app.use(`${base}/users`, userRoutes);
  app.use(`${base}/messages`, messageRoutes);
};
