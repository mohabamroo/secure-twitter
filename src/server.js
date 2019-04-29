import http from "http";
import app from "./app";
import https from "https";
import fs from "fs";

const PORT = process.env.PORT || 5000;

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Secure Twitter listening on ${bind}`);
};

const server = https.createServer(
  {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
    passphrase: process.env.PASSPHRASE
  },
  app
);
server.listen(PORT);
server.on("listening", onListening);

export default server;
