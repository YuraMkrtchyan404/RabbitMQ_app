import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { UserRoutes } from "./routes/UserRouts";
import { RabbitMQConnection } from "./utils/RabbitMQConnection";
import { error, log } from "console";
import { MessageHandler } from "./utils/MessageHandler";
import swaggerDocs from "./utils/swagger";

const app = express();
const URL = "amqp://username:password@localhost:5672";
const RETRY_QUEUE_NAME = "retryQueue";
const QUEUE_NAME = "messageQueue";
const port = 3000;
require("dotenv").config({ path: ".env" });

app.use(bodyParser.json());
app.use(cors());

const main = async () => {
  const userRoutes = new UserRoutes();
  app.use(userRoutes.getRouter());

  await RabbitMQConnection.init(URL, QUEUE_NAME);
  await RabbitMQConnection.consumeMessage(RETRY_QUEUE_NAME, MessageHandler.receiveResponse).catch(
    (err) => {
      error("Failed to consume the message:", err);
      process.exit(1);
    }
  );
};
swaggerDocs(app, port); // Register Swagger documentation before starting the server

app.listen(port, async () => {
  console.log("Server listening on port 3000");
});

main().catch((err) => {
  error("Failed to initialize the app:", err);
  process.exit(1);
});