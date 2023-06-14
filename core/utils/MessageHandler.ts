import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from '../utils/RabbitMQConnection'
import { MessagingCodes } from '../utils/MessagingCodes.enum'
import { UserService } from '../services/UserService'

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
            const messageDestination: MessagingCodes = information.type
            return await MessageHandler.executeCRUD(information, messageDestination)
        } catch (error: any) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error.message }, queueName)
        }
    }

    private static async executeCRUD(information: any, messageDestination: MessagingCodes) {

        switch (messageDestination) {
            case MessagingCodes.GET_USER:
                return await UserService.getUser(information)

            case MessagingCodes.ADD_USER:
                return await UserService.registerUser(information)

            case MessagingCodes.UPDATE_USER:
                return await UserService.updateUser(information)

            case MessagingCodes.DELETE_USER:
                return await UserService.deleteUser(information)

            case MessagingCodes.GET_USERS:
                return await UserService.getUsers(information)

            case MessagingCodes.LOGIN_USER:
                return await UserService.loginUser(information)

            default:
                log("Invalid message destination")
                break
        }
    }

    private static async sendResponseToQueue(responseObject: any, queueName: string, messageId: string) {
        if (responseObject) {
            await RabbitMQConnection.sendMessage({
                id: messageId,
                data: { ...responseObject },
            }, queueName)
        }
    }
}