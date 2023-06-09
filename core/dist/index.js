"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RabbitMQConnection_1 = require("./utils/RabbitMQConnection");
const console_1 = require("console");
const UserService_1 = require("./services/UserService");
const URL = "amqp://username:password@localhost:5672";
const QUEUE_NAME = "messageQueue";
const RETRY_QUEUE_NAME = "retryQueue";
const main = async () => {
    await RabbitMQConnection_1.RabbitMQConnection.init(URL, RETRY_QUEUE_NAME);
    await RabbitMQConnection_1.RabbitMQConnection.consumeMessage(QUEUE_NAME, (msg) => {
        UserService_1.UserService.manipulateDatabase(msg, RETRY_QUEUE_NAME);
    }).catch((err) => {
        console.error("Failed to consume the message:", err);
        process.exit(1);
    });
    console.log('Started consuming from messageQueue');
};
main().catch((err) => {
    (0, console_1.error)("Failed to initialize the app:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map