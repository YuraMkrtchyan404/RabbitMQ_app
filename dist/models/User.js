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
    async get() {
        try {
            if (!this.id) {
                throw new Error('Cannot get user without ID');
            }
            const user = await prisma.users.findUnique({
                where: { id: this.id },
            });
            if (user) {
                RabbitMQConnection_1.RabbitMQConnection.sendMessage({
                    type: messagingcodes_enum_1.MessagingCodes.GET_USER_RESPONSE,
                    data: {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        password: user.password,
                        birthday: user.birthday,
                    },
                }, RabbitMQConnection_1.RabbitMQConnection.queueName);
            }
        }
        catch (error) {
            console.error('Error while getting the user: ', error);
        }
    }
    async save() {
        await prisma.users.create({
            data: {
                name: this.name,
                surname: this.surname,
                password: this.password,
                birthday: this.birthday,
            },
        });
    }
    async update() {
        try {
            if (!this.id) {
                throw new Error('Cannot update user without ID');
            }
            await prisma.users.update({
                where: { id: this.id },
                data: {
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    birthday: this.birthday,
                },
            });
        }
        catch (error) {
            console.error('Error while updating the user: ', error);
            throw error;
        }
    }
    async delete() {
        try {
            if (!this.id) {
                throw new Error('Cannot delete user without ID');
            }
            await prisma.users.delete({
                where: { id: this.id },
            });
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