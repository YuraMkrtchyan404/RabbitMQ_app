import { User } from "../models/User"
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
require('dotenv').config({ path: '.env' });

export class UserService {

    public static async registerUser(userInformation: any) {
        const user = await (new User(userInformation)).saveUser()
        const userId = user.id.toString()
        const token = UserService.generateToken(userId)

        return { token: token }
    }

    public static async loginUser(userInformation: any) {
        const password: string = userInformation.data.password

        const user = await (new User(userInformation)).findUserByEmail();

        if (user && await bcrypt.compare(password, user!.password)) {
            const token = UserService.generateToken(user!.id.toString())
            return { token: token }
        } else {
            throw new Error('Wrong credentials: try again')
        }
    }

    public static async getUser(userInformation: any) {
        const user: User = new User(userInformation)
        return await user.getUser()
    }

    public static async updateUser(userInformation: any) {
        if (userInformation.data.decodedUser.id === userInformation.data.id) {
            const user: User = new User(userInformation)
            return await user.updateUser()
        } else {
            throw new Error('Unauthorized: Cannot update another user')
        }
    }

    public static async deleteUser(userInformation: any) {
        if (userInformation.data.decodedUser.id === userInformation.data.id) {
            const user: User = new User(userInformation)
            return await user.deleteUser()
        } else {
            throw new Error('Unauthorized: Cannot delete another user')
        }
    }

    public static async getUsers(userInformation: any) {
        const user: User = new User(userInformation)
        return await user.getUsers()
    }

    private static generateToken(userId: string): string {

        const jwt_secret_key = process.env.JWT_SECRET_KEY
        const token = jwt.sign({ id: userId }, jwt_secret_key!, { expiresIn: '1h' });
        return token;
    }
}

