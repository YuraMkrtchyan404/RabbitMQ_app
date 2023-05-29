"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConnection = void 0;
const amqp = __importStar(require("amqplib"));
const User_1 = require("../models/User");
const console_1 = require("console");
class RabbitMQConnection {
    static async init(url, queueName) {
        RabbitMQConnection.connection = await amqp.connect(url);
        RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();
        await RabbitMQConnection.channel.assertQueue(queueName, { durable: false });
    }
    static sendMessage(message, queueName) {
        RabbitMQConnection.channel.sendToQueue(queueName, Buffer.from(message));
        console.log(message);
    }
    ;
    static async consumeMessage(queueName) {
        RabbitMQConnection.channel.consume(queueName, RabbitMQConnection.saveToDatabase, { noAck: false });
    }
    static async saveToDatabase(msg) {
        if (msg) {
            try {
                const user = RabbitMQConnection.generateUser(msg);
                await user.save();
                console.log('Receved new User information: ' + user.getName() + " " + user.getSurname());
                RabbitMQConnection.channel.ack(msg);
            }
            catch (error) {
                (0, console_1.log)(error);
            }
        }
    }
    ;
    static generateUser(msg) {
        const userInformaition = msg.content.toString().split(" ");
        const name = userInformaition[0];
        const surname = userInformaition[1];
        const password = userInformaition[2];
        const birthday = userInformaition[3];
        const user = new User_1.User(name, surname, password, new Date(birthday));
        return user;
    }
}
RabbitMQConnection.connection = null;
RabbitMQConnection.channel = null;
RabbitMQConnection.queueName = null;
exports.RabbitMQConnection = RabbitMQConnection;
//# sourceMappingURL=RabbitMQConnection.js.map