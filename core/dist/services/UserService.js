"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const console_1 = require("console");
const RabbitMQConnection_1 = require("../utils/RabbitMQConnection");
const User_1 = require("../models/User");
const messagingcodes_enum_1 = require("../utils/messagingcodes.enum");
class UserService {
    static async manipulateDatabase(msg, queueName) {
        if (msg) {
            const informationString = msg.content.toString('utf8');
            const information = JSON.parse(informationString);
            const messageDestination = information.type;
            try {
                switch (messageDestination) {
                    case messagingcodes_enum_1.MessagingCodes.GET_USER:
                        await UserService.getUserFromDatabase(information, queueName);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.ADD_USER:
                        await UserService.addUserToDatabase(information, queueName);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.UPDATE_USER:
                        await UserService.updateUserInDatabase(information, queueName);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.DELETE_USER:
                        (0, console_1.log)("reached to switch");
                        await UserService.deleteUserFromDatabase(information, queueName);
                        break;
                    case messagingcodes_enum_1.MessagingCodes.GET_USERS:
                        await UserService.getUsersFromDatabase(information, queueName);
                        break;
                    default:
                        (0, console_1.log)("No matching condition found for messageDestination");
                        break;
                }
                RabbitMQConnection_1.RabbitMQConnection.channel.ack(msg);
            }
            catch (error) {
                (0, console_1.log)(error);
            }
        }
    }
    static async getUserFromDatabase(userInformaition, queueName) {
        const id = parseInt(userInformaition.data.id);
        const messageId = userInformaition.id;
        const user = User_1.User.generateEmptyUser();
        user.setId(id);
        await user.getAndSendBackToRabbitMQ(messageId, queueName);
    }
    static async getUsersFromDatabase(userInformation, queueName) {
        const messageId = userInformation.id;
        const user = User_1.User.generateEmptyUser();
        await user.getManyAndSendBackToRabbitMQ(messageId, queueName);
    }
    static async addUserToDatabase(userInformaition, queueName) {
        const messageId = userInformaition.id;
        const user = UserService.generateUser(userInformaition);
        await user.saveAndSendBackToRabbitMQ(messageId, queueName);
        console.log('Receved new User information: ' + user.getName() + " " + user.getSurname());
    }
    static async updateUserInDatabase(userInformaition, queueName) {
        const messageId = userInformaition.id;
        const user = UserService.generateUser(userInformaition);
        const id = parseInt(userInformaition.data.id);
        user.setId(id);
        await user.updateAndSendBackToRabbitMQ(messageId, queueName);
        (0, console_1.log)('RECEIVED: ', userInformaition);
    }
    static async deleteUserFromDatabase(userInformaition, queueName) {
        const messageId = userInformaition.id;
        const user = User_1.User.generateEmptyUser();
        const id = parseInt(userInformaition.data.id);
        user.setId(id);
        await user.deleteAndSendBackToRabbitMQ(messageId, queueName);
        (0, console_1.log)('DELETED: ', JSON.stringify(userInformaition));
    }
    static generateUser(userInformaition) {
        const name = userInformaition.data.name;
        const surname = userInformaition.data.surname;
        const password = userInformaition.data.password;
        const birthday = userInformaition.data.birthday;
        const user = new User_1.User(name, surname, password, new Date(birthday));
        (0, console_1.log)("this is the user created in generateUser method: ", user);
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map