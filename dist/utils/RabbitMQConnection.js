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
const messagingcodes_enum_1 = require("./messagingcodes.enum");
class RabbitMQConnection {
    static async init(url, queueName) {
        RabbitMQConnection.connection = await amqp.connect(url);
        RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();
        await RabbitMQConnection.channel.assertQueue(queueName, { durable: false });
    }
    static sendMessage(msg, queueName) {
        RabbitMQConnection.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)));
        console.log('SENT: ', JSON.stringify(msg));
    }
    // Consumer part
    static async consumeMessage(queueName) {
        RabbitMQConnection.channel.consume(queueName, RabbitMQConnection.manipulateDatabase, { noAck: false });
    }
    static async manipulateDatabase(msg) {
        if (msg) {
            const informationString = msg.content.toString('utf8');
            const information = JSON.parse(informationString);
            const messageDestination = information.type;
            (0, console_1.log)(information);
            try {
                switch (messageDestination) {
                    case messagingcodes_enum_1.MessagingCodes.GET_USER:
                        await RabbitMQConnection.getUserFromDatabase(information);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.ADD_USER:
                        await RabbitMQConnection.addUserToDatabase(information);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.UPDATE_USER:
                        await RabbitMQConnection.updateUserInDatabase(information);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.DELETE_USER:
                        await RabbitMQConnection.deleteUserFromDatabase(information);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.GET_USER_RESPONSE:
                        await RabbitMQConnection.receiveUserInformation(information);
                        break;
                    default:
                        (0, console_1.log)("No matching condition found for messageDestination");
                        break;
                }
                RabbitMQConnection.channel.ack(msg);
            }
            catch (error) {
                (0, console_1.log)(error);
            }
        }
    }
    // User CRUD operations
    static async getUserFromDatabase(userInformaition) {
        const id = parseInt(userInformaition.data.id);
        const user = User_1.User.generateEmptyUser();
        user.setId(id);
        await user.get();
        (0, console_1.log)('Retrieved user with id: ', id, ' and sent to the rabbit');
    }
    static async addUserToDatabase(userInformaition) {
        const user = RabbitMQConnection.generateUser(userInformaition);
        await user.save();
        console.log('Receved new User information: ' + user.getName() + " " + user.getSurname());
    }
    static async updateUserInDatabase(userInformaition) {
        const user = RabbitMQConnection.generateUser(userInformaition);
        const id = parseInt(userInformaition.data.id);
        user.setId(id);
        await user.update();
        (0, console_1.log)('RECEIVED: ', JSON.stringify(userInformaition));
    }
    static async deleteUserFromDatabase(userInformaition) {
        const id = parseInt(userInformaition.data.id);
        const user = User_1.User.generateEmptyUser();
        user.setId(id);
        await user.delete();
        (0, console_1.log)('DELETED: ', JSON.stringify(userInformaition));
    }
    static async receiveUserInformation(userInformaition) {
        const user = RabbitMQConnection.generateUser(userInformaition);
        const id = parseInt(userInformaition.data.id);
        user.setId(id);
        (0, console_1.log)('Response User: ', user);
    }
    static generateUser(userInformaition) {
        const name = userInformaition.data.name;
        const surname = userInformaition.data.surname;
        const password = userInformaition.data.password;
        const birthday = userInformaition.data.birthday;
        const user = new User_1.User(name, surname, password, new Date(birthday));
        return user;
    }
}
RabbitMQConnection.connection = null;
RabbitMQConnection.channel = null;
RabbitMQConnection.queueName = null;
exports.RabbitMQConnection = RabbitMQConnection;
//# sourceMappingURL=RabbitMQConnection.js.map