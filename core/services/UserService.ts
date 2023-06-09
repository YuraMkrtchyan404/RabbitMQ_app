import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from '../utils/RabbitMQConnection'
import { User } from '../models/User'
import { MessagingCodes } from '../utils/messagingcodes.enum'

export class UserService {

    public static async manipulateDatabase(msg: amqp.ConsumeMessage | null, queueName: string) {
        if (msg) {
            const informationString: string = msg.content.toString('utf8')
            const information: any = JSON.parse(informationString)
            const messageDestination: MessagingCodes = information.type

            try {
                switch (messageDestination) {
                    case MessagingCodes.GET_USER:
                        await UserService.getUserFromDatabase(information, queueName)
                        break

                    case MessagingCodes.ADD_USER:
                        await UserService.addUserToDatabase(information, queueName)
                        break

                    case MessagingCodes.UPDATE_USER:
                        await UserService.updateUserInDatabase(information, queueName)
                        break

                    case MessagingCodes.DELETE_USER:
                        log("reached to switch")
                        await UserService.deleteUserFromDatabase(information, queueName)
                        break

                    case MessagingCodes.GET_USERS:
                        await UserService.getUsersFromDatabase(information, queueName)
                        break

                    default:
                        log("No matching condition found for messageDestination")
                        break
                }
                RabbitMQConnection.channel!.ack(msg)
            } catch (error) {
                log(error)
            }
        }
    }

    private static async getUserFromDatabase(userInformaition: any, queueName: string) {
        const id: number = parseInt(userInformaition.data.id)
        const messageId: string = userInformaition.id
        const user: User = User.generateEmptyUser()
        user.setId(id)
        await user.getAndSendBackToRabbitMQ(messageId, queueName)
    }

    private static async getUsersFromDatabase(userInformation: any, queueName: string) {
        const messageId: string = userInformation.id
        const user: User = User.generateEmptyUser()
        await user.getManyAndSendBackToRabbitMQ(messageId, queueName)
    }

    private static async addUserToDatabase(userInformaition: any, queueName: string) {
        const messageId = userInformaition.id
        const user: User = UserService.generateUser(userInformaition)
        await user.saveAndSendBackToRabbitMQ(messageId, queueName)
        console.log('Receved new User information: ' + user.getName() + " " + user.getSurname())
    }

    private static async updateUserInDatabase(userInformaition: any, queueName: string) {
        const messageId = userInformaition.id
        const user: User = UserService.generateUser(userInformaition)
        const id: number = parseInt(userInformaition.data.id)
        user.setId(id)
        await user.updateAndSendBackToRabbitMQ(messageId, queueName)
        log('RECEIVED: ', userInformaition)
    }

    private static async deleteUserFromDatabase(userInformaition: any, queueName: string) {
        const messageId = userInformaition.id
        const user: User = User.generateEmptyUser()
        const id: number = parseInt(userInformaition.data.id)
        user.setId(id)
        await user.deleteAndSendBackToRabbitMQ(messageId, queueName)
        log('DELETED: ', JSON.stringify(userInformaition))
    }

    public static generateUser(userInformaition: any): User {
        const name: string = userInformaition.data.name
        const surname: string = userInformaition.data.surname
        const password: string = userInformaition.data.password
        const birthday: string = userInformaition.data.birthday
        const user: User = new User(name, surname, password, new Date(birthday))
        log("this is the user created in generateUser method: ", user)
        return user
    }
}
