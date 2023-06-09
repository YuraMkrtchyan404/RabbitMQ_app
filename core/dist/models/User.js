"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const PrismaConnection_1 = require("../utils/PrismaConnection");
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
    constructor(userInformation) {
        const name = userInformation.data.name;
        const surname = userInformation.data.surname;
        const password = userInformation.data.password;
        const birthday = userInformation.data.birthday;
        const id = userInformation.data.id;
        if (name) {
            this.name = name;
        }
        if (surname) {
            this.surname = surname;
        }
        if (password) {
            this.password = password;
        }
        if (birthday) {
            this.birthday = new Date(birthday);
        }
        if (id) {
            this.id = parseInt(id);
        }
    }
    async getUser() {
        try {
            if (!this.id) {
                throw new Error('Cannot get user without ID');
            }
            const user = await PrismaConnection_1.PrismaConnection.prisma.users.findUnique({
                where: { id: this.id },
                rejectOnNotFound: true,
            });
            return user;
        }
        catch (error) {
            console.error('Error while getting the user: ', error);
            throw error;
        }
    }
    async getUsers() {
        try {
            const users = await PrismaConnection_1.PrismaConnection.prisma.users.findMany();
            return users;
        }
        catch (error) {
            console.error('Error while getting the user: ', error);
            throw error;
        }
    }
    async saveUser() {
        try {
            const user = await PrismaConnection_1.PrismaConnection.prisma.users.create({
                data: {
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    birthday: this.birthday,
                },
            });
            return user;
        }
        catch (error) {
            console.log('Error while adding new user: ', error);
            throw error;
        }
    }
    async updateUser() {
        try {
            if (!this.id) {
                throw new Error('Cannot update user without ID');
            }
            const user = await PrismaConnection_1.PrismaConnection.prisma.users.update({
                where: { id: this.id },
                data: {
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    birthday: this.birthday,
                },
            });
            return user;
        }
        catch (error) {
            console.error('Error while updating the user: ', error);
            throw error;
        }
    }
    async deleteUser() {
        try {
            if (!this.id) {
                throw new Error('Cannot delete user without ID');
            }
            const user = await PrismaConnection_1.PrismaConnection.prisma.users.delete({
                where: { id: this.id },
            });
            return user;
        }
        catch (error) {
            console.error('Error while deleting the user:', error);
            throw error;
        }
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map