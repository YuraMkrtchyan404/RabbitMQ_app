"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const client_1 = require("@prisma/client");
const RabbitMQConnection_1 = require("../utils/RabbitMQConnection");
const messagingcodes_enum_1 = require("../utils/messagingcodes.enum");
const prisma = new client_1.PrismaClient();
class User {
    getName() {
        return this.name;
    }
    setName(v) {
        this.name = v;
    }
    getSurname() {
        return this.surname;
    }
    setSurname(v) {
        this.surname = v;
    }
    getId() {
        return this.id;
    }
    setId(v) {
        this.id = v;
    }
    constructor(name, surname, password, birthday, id) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.birthday = birthday;
        this.id = id;
    }
    async getAndSendBackToRabbitMQ(messageId, queueName) {
        try {
            if (!this.id) {
                throw new Error('Cannot get user without ID');
            }
            const user = await prisma.users.findUnique({
                where: { id: this.id },
            });
            if (user) {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    id: messageId,
                    type: messagingcodes_enum_1.MessagingCodes.GET_RESPONSE,
                    data: { user },
                }, queueName);
            }
            else {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({ id: messageId, error: "User not found" }, queueName);
            }
        }
        catch (error) {
            console.error('Error while getting the user: ', error);
            throw error;
        }
    }
    async getManyAndSendBackToRabbitMQ(messageId, queueName) {
        try {
            const users = await prisma.users.findMany();
            if (users) {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    id: messageId,
                    type: messagingcodes_enum_1.MessagingCodes.GET_MANY_RESPONSE,
                    data: { users },
                }, queueName);
            }
            else {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({ id: messageId, error: "Users not found" }, queueName);
            }
        }
        catch (error) {
            console.error('Error while getting the user: ', error);
            throw error;
        }
    }
    async saveAndSendBackToRabbitMQ(messageId, queueName) {
        try {
            const user = await prisma.users.create({
                data: {
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    birthday: this.birthday,
                },
            });
            if (user) {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    id: messageId,
                    type: messagingcodes_enum_1.MessagingCodes.ADD_RESPONSE,
                    data: { user },
                }, queueName);
            }
            else {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({ id: messageId, error: "User not added" }, queueName);
            }
        }
        catch (error) {
            console.log('Error while adding new user: ', error);
            throw error;
        }
    }
    async updateAndSendBackToRabbitMQ(messageId, queueName) {
        try {
            if (!this.id) {
                throw new Error('Cannot update user without ID');
            }
            const user = await prisma.users.update({
                where: { id: this.id },
                data: {
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    birthday: this.birthday,
                },
            });
            if (user) {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    id: messageId,
                    type: messagingcodes_enum_1.MessagingCodes.UPDATE_RESPONSE,
                    data: { user },
                }, queueName);
            }
            else {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({ id: messageId, error: "User not updated" }, queueName);
            }
        }
        catch (error) {
            console.error('Error while updating the user: ', error);
            throw error;
        }
    }
    async deleteAndSendBackToRabbitMQ(messageId, queueName) {
        try {
            if (!this.id) {
                throw new Error('Cannot delete user without ID');
            }
            const user = await prisma.users.delete({
                where: { id: this.id },
            });
            if (user) {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    id: messageId,
                    type: messagingcodes_enum_1.MessagingCodes.UPDATE_RESPONSE,
                    data: { user },
                }, queueName);
            }
            else {
                await RabbitMQConnection_1.RabbitMQConnection.sendMessage({ id: messageId, error: "User not deleted" }, queueName);
            }
        }
        catch (error) {
            console.error('Error while deleting the user:', error);
            throw error;
        }
    }
    static generateEmptyUser() {
        return new User("", "", "", new Date());
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map