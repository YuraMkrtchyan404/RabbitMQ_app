"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const RabbitMQConnection_1 = require("../utils/RabbitMQConnection");
const console_1 = require("console");
const messagingcodes_enum_1 = require("../utils/messagingcodes.enum");
class UserController {
    constructor(queueName) {
        RabbitMQConnection_1.RabbitMQConnection.queueName = queueName;
    }
    async initRabbitMQConnection(url) {
        await RabbitMQConnection_1.RabbitMQConnection.init(url, RabbitMQConnection_1.RabbitMQConnection.queueName).catch(error => {
            (0, console_1.log)("Failed to initialize the connection: ", error);
            process.exit(1);
        });
    }
    async getUserMessage(req, res) {
        try {
            RabbitMQConnection_1.RabbitMQConnection.sendMessage({ type: messagingcodes_enum_1.MessagingCodes.GET_USER, data: { id: req.params.id } }, RabbitMQConnection_1.RabbitMQConnection.queueName);
            res.sendStatus(200);
        }
        catch (error) {
            (0, console_1.log)(error);
            res.sendStatus(500);
        }
    }
    async addUserMessage(req, res) {
        try {
            RabbitMQConnection_1.RabbitMQConnection.sendMessage({ type: messagingcodes_enum_1.MessagingCodes.ADD_USER, data: { ...req.body } }, RabbitMQConnection_1.RabbitMQConnection.queueName);
            res.sendStatus(200);
        }
        catch (error) {
            (0, console_1.log)(error);
            res.sendStatus(500);
        }
    }
    async updateUserMessage(req, res) {
        try {
            RabbitMQConnection_1.RabbitMQConnection.sendMessage({ type: messagingcodes_enum_1.MessagingCodes.UPDATE_USER, data: { ...req.body, id: req.params.id } }, RabbitMQConnection_1.RabbitMQConnection.queueName);
            res.sendStatus(200);
        }
        catch (error) {
            (0, console_1.log)(error);
            res.sendStatus(500);
        }
    }
    async deleteUserMessage(req, res) {
        try {
            RabbitMQConnection_1.RabbitMQConnection.sendMessage({ type: messagingcodes_enum_1.MessagingCodes.DELETE_USER, data: { id: req.params.id } }, RabbitMQConnection_1.RabbitMQConnection.queueName);
            res.sendStatus(200);
        }
        catch (error) {
            (0, console_1.log)(error);
            res.sendStatus(500);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map