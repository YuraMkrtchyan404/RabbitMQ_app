import { Request, Response } from "express";
import { RabbitMQConnection } from "../utils/RabbitMQConnection";
import { log } from "console";
import { MessagingCodes } from "../utils/messagingcodes.enum";

export class UserController {

    constructor(queueName: string) {
        RabbitMQConnection.queueName = queueName;
    }
    
    public async initRabbitMQConnection(url: string) {
        await RabbitMQConnection.init(url, RabbitMQConnection.queueName!).catch(error => {
            log("Failed to initialize the connection: ", error);
            process.exit(1);
        })
    }

    public async getUserMessage(req: Request, res: Response) {
        try {
            RabbitMQConnection.sendMessage({ type: MessagingCodes.GET_USER, data: { id: req.params.id } }, RabbitMQConnection.queueName!);
            res.sendStatus(200);
        } catch (error) {
            log(error);
            res.sendStatus(500);
        }
    }

    public async addUserMessage(req: Request, res: Response) {
        try {
            RabbitMQConnection.sendMessage({ type: MessagingCodes.ADD_USER, data: { ...req.body } }, RabbitMQConnection.queueName!);
            res.sendStatus(200);
        } catch (error) {
            log(error);
            res.sendStatus(500);
        }
    }

    public async updateUserMessage(req: Request, res: Response) {
        try {
            RabbitMQConnection.sendMessage({ type: MessagingCodes.UPDATE_USER, data: { ...req.body, id: req.params.id } }, RabbitMQConnection.queueName!);
            res.sendStatus(200);
        } catch (error) {
            log(error);
            res.sendStatus(500);
        }
    }

    public async deleteUserMessage(req: Request, res: Response) {
        try {
            RabbitMQConnection.sendMessage({ type: MessagingCodes.DELETE_USER, data: { id: req.params.id } }, RabbitMQConnection.queueName!);
            res.sendStatus(200);
        } catch (error) {
            log(error);
            res.sendStatus(500);
        }
    }
}
