"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const UserRouts_1 = require("./routes/UserRouts");
const RabbitMQConnection_1 = require("./utils/RabbitMQConnection");
const console_1 = require("console");
const app = (0, express_1.default)();
const URL = "amqp://username:password@localhost:5672";
const QUEUE_NAME = "messageQueue";
const port = 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const main = async () => {
    // initialize the rout
    const userRoutes = new UserRouts_1.UserRoutes(QUEUE_NAME);
    await userRoutes.getUserController().initRabbitMQConnection(URL);
    (0, console_1.log)("Finished setting up the router");
    app.use(userRoutes.getRouter());
    // initialize the rabbitMQ consumer
    await RabbitMQConnection_1.RabbitMQConnection.consumeMessage(QUEUE_NAME).catch((err) => {
        console.error("Failed to consume the message:", err);
        process.exit(1);
    });
};
app.listen(port, () => {
    console.log("Server listening on port 3000");
});
main().catch((err) => {
    (0, console_1.error)("Failed to initialize the app:", err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map