import { User } from "../models/User"
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from "lodash";
import { MessagingCodes } from "../../../utils/MessagingCodes.enum";

export class UserService {

    public static async registerUser(userInformation: {id: string, type: MessagingCodes, data: any}) {
        const userWithoutPassword = await (new User(userInformation)).saveUser()
        const userId = userWithoutPassword.id.toString()
        const token = UserService.generateToken(userId)

        return { user: userWithoutPassword, token: token }
    }

    public static async loginUser(userInformation: {id: string, type: MessagingCodes, data: any}) {
        const password: string = userInformation.data.password

        const user = await new User(userInformation).findUserByEmail();

        if (user && await bcrypt.compare(password, user.password)) {
            const token = UserService.generateToken(user.id.toString())
            const userWithoutPassword = _.omit(user, 'password')
            return { user: userWithoutPassword, token: token }
        } else {
            throw new Error('Wrong credentials: try again')
        }
    }

    public static async getUser(userInformation: {id: string, type: MessagingCodes, data: any}) {
        const userWithoutPassword: User = new User(userInformation)
        return await userWithoutPassword.getUser()
    }

    public static async updateUser(userInformation: {id: string, type: MessagingCodes, data: any}) {
        if (userInformation.data.decodedUser.id === userInformation.data.id) {
            const user: User = new User(userInformation)
            const userWithoutPassword = await user.updateUser()
            return userWithoutPassword
        } else {
            throw new Error('Unauthorized: Cannot update another user')
        }
    }

    public static async deleteUser(userInformation: {id: string, type: MessagingCodes, data: any}) {
        if (userInformation.data.decodedUser.id === userInformation.data.id) {
            const user: User = new User(userInformation)
            const userWithoutPassword = await user.deleteUser()
            return userWithoutPassword
        } else {
            throw new Error('Unauthorized: Cannot delete another user')
        }
    }

    public static async getUsers(userInformation: {id: string, type: MessagingCodes, data: any}) {
        const user: User = new User(userInformation)
        const usersWithoutPassword = await user.getUsers()
        return usersWithoutPassword
    }

    private static generateToken(userId: string): string {
        const jwt_secret_key = process.env.JWT_SECRET_KEY
        const token = jwt.sign({ id: userId }, jwt_secret_key!, { expiresIn: '1h' });
        return token;
    }
}

