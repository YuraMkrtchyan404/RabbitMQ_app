import { Request, Response } from "express"
import { MessagingCodes } from "../utils/messagingcodes.enum"
import { MessageHandler } from "../utils/MessageHandler"

export class Controller {

    public async getUserMessage(req: Request, res: Response, queueName: string) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.GET_USER, { id: req.params.id, ...req.body }, req, res, queueName)
    }

    public async getUsersMessage(req: Request, res: Response, queueName: string) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.GET_USERS, {}, req, res, queueName)
    }

    public async updateUserMessage(req: Request, res: Response, queueName: string) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.UPDATE_USER, { ...req.body, id: req.params.id }, req, res, queueName)
    }

    public async deleteUserMessage(req: Request, res: Response, queueName: string) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.DELETE_USER, { id: req.params.id, ...req.body }, req, res, queueName)
    }

    public async registerUserMessage(req: Request, res: Response, queueName: string) {
        await MessageHandler.sendMessageToQueue(MessagingCodes.ADD_USER, { ...req.body }, req, res, queueName)
    }

    public async loginUserMessage(req: Request, res: Response, queueName: string){
        await MessageHandler.sendMessageToQueue(MessagingCodes.LOGIN_USER, { ...req.body }, req, res, queueName)
    }
}
