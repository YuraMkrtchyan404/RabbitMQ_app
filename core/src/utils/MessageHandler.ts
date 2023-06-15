import * as amqp from 'amqplib'
import { log } from "console"
import { RabbitMQConnection } from './RabbitMQConnection'
import { MessagingCodes } from './MessagingCodes.enum'
import { UserService } from '../components/user/services/UserService'

export class MessageHandler {

    public static async handleMessage(msg: amqp.ConsumeMessage | null, queueName: string) {
        const informationString: string = msg!.content.toString('utf8')
        const information: {id: string, type: MessagingCodes, data: any} = JSON.parse(informationString)
        const messageId: string = information.id
        const responseObject: any = await MessageHandler.manipulateDatabase(information, queueName)
        RabbitMQConnection.channel!.ack(msg!)

        await MessageHandler.sendResponseToQueue(responseObject, queueName, messageId)
    }

    private static async manipulateDatabase(information: {id: string, type: MessagingCodes, data: any}, queueName: string) {
        try {
            return await MessageHandler.executeCRUD(information)
        } catch (error: any) {
            log("sending error as response")
            await RabbitMQConnection.sendMessage({ id: information.id, error: error.message }, queueName)
        }
    }

    private static async executeCRUD(information: {id: string, type: MessagingCodes, data: any}) {

        const messageDestination: MessagingCodes = information.type

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