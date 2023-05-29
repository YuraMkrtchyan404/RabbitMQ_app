"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const RabbitMQConnection_1 = require("../utils/RabbitMQConnection");
const User_1 = require("../models/User");
const console_1 = require("console");
class UserController {
    constructor(queueName) {
        RabbitMQConnection_1.RabbitMQConnection.queueName = queueName;
    }
    async initRabbitMQConnection(url) {
        (0, console_1.log)("CONTOLLER properties while initializing the rabbitMQSender: \n", "QUEUE NAME \n", RabbitMQConnection_1.RabbitMQConnection.queueName, '\n');
        await RabbitMQConnection_1.RabbitMQConnection.init(url, RabbitMQConnection_1.RabbitMQConnection.queueName).catch(error => {
            (0, console_1.log)("Failed to initialize the connection: ", error);
            process.exit(1);
        });
        (0, console_1.log)("RABBITMQ CONNECTION is initialized, QUEUE NAME IS ", RabbitMQConnection_1.RabbitMQConnection.queueName);
    }
    async sendMessage(req, res) {
        try {
            const { name, surname, password, birthday } = await req.body;
            const user = new User_1.User(name, surname, password, birthday);
            const userInformaition = name + " " + surname + " " + password + " " + birthday;
            RabbitMQConnection_1.RabbitMQConnection.sendMessage(userInformaition, RabbitMQConnection_1.RabbitMQConnection.queueName);
            res.sendStatus(200);
        }
        catch (error) {
            (0, console_1.log)("HERE: problem with sending message in the controller \n", error);
            res.sendStatus(500);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map