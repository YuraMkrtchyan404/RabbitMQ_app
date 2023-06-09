import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from '../utils/RabbitMQConnection'
import { User } from '../models/User'
import { UserMessagingCodes } from '../utils/MessagingCodes.enum'

export class MessageHandler {

    public static async handleMessage(msg: amqp.ConsumeMessage | null, queueName: string) {
        const informationString: string = msg!.content.toString('utf8')
        const information: any = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)
        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    private static async manipulateDatabase(information: any, queueName: string) {
        try {
            const messageDestination: UserMessagingCodes = information.type
            let responseObject: any
            if (messageDestination in UserMessagingCodes) {
                responseObject = await MessageHandler.executeCRUD(information, messageDestination, responseObject)
            }
            return responseObject
        } catch (error) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error }, queueName)
            log(error)
        }
    }

    private static async executeCRUD(information: any, messageDestination: UserMessagingCodes, responseObject: any) {
        const tempUser: User = new User(information)

        switch (messageDestination) {
            case UserMessagingCodes.GET_USER:
                responseObject = await tempUser.getUser()
                break

            case UserMessagingCodes.ADD_USER:
                responseObject = await tempUser.saveUser()
                break

            case UserMessagingCodes.UPDATE_USER:
                responseObject = await tempUser.updateUser()
                break

            case UserMessagingCodes.DELETE_USER:
                responseObject = await tempUser.deleteUser()
                break

            case UserMessagingCodes.GET_USERS:
                responseObject = await tempUser.getUsers()
                break

            default:
                log("Invalid message destination")
                break
        }
        return responseObject
    }

    private static async sendResponseToQueue(responseObject: any, queueName: string, messageId: string) {
        if (responseObject) {
            await RabbitMQConnection.sendMessage({
                id: messageId,
                data: { responseObject },
            }, queueName)
        }
    }
}