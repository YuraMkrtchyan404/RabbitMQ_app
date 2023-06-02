import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { UserRoutes } from "./routes/UserRouts";
import { RabbitMQConnection } from "./utils/RabbitMQConnection";
import { error, log } from "console";

const app = express();
const URL = "amqp://username:password@localhost:5672";
const QUEUE_NAME = "messageQueue";
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const main = async () => {

    // initialize the rout
    const userRoutes = new UserRoutes(QUEUE_NAME);
    await userRoutes.getUserController().initRabbitMQConnection(URL);
    // log("Finished setting up the router");
    app.use(userRoutes.getRouter());

    // initialize the rabbitMQ consumer
    await RabbitMQConnection.consumeMessage(QUEUE_NAME).catch((err) => {
        console.error("Failed to consume the message:", err);
        process.exit(1);
    });
}

app.listen(port, () => {
    console.log("Server listening on port 3000");
});

main().catch((err) => {
    error("Failed to initialize the app:", err);
    process.exit(1);
})