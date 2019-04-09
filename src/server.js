import http from "http";
import app from "./app";

const PORT = process.env.PORT || 5000;

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Secure Twitter listening on ${bind}`);
};

const server = http.createServer(app);

server.listen(PORT);
server.on("listening", onListening);

export default server;
