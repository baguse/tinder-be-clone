import http from "http";

import chai from "chai";
import chaiHttp from "chai-http";
import app from "@app";

chai.should();
chai.use(chaiHttp);

app.set("port", 3001);
const server = http.createServer(app);

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      // eslint-disable-next-line no-console
      console.error("Port requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // eslint-disable-next-line no-console
      console.error("Port is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  // eslint-disable-next-line no-console
  console.log("Server running on port 3001");
});

function POST(props: {
  url: string;
  body: Record<string, unknown>;
  cookie?: string;
}) {
  const requester = chai
    .request(app)
    .post(props.url)
    .set("Content-Type", "application/json");
  if (props.cookie) requester
    .set("Cookie", props.cookie);

  return requester.send(props.body);
}

function GET(props: {
  url: string;
  cookie?: string;
}) {
  const requester = chai
    .request(app)
    .get(props.url)
    .set("Content-Type", "application/json");
  if (props.cookie) requester
    .set("Cookie", props.cookie);

  return requester;
}

export default {
  POST,
  GET,
};
