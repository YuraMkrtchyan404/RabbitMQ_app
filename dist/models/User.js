"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const client_1 = require("@prisma/client");
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
    constructor(name, surname, password, birthday) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.birthday = birthday;
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
}
exports.User = User;
//   public static findById(id: number): User | undefined {
// 	// Logic to find user by ID in the database
// }
//# sourceMappingURL=User.js.map