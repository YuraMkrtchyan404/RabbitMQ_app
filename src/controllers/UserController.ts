import { Request, Response } from "express";
import { RabbitMQConnection } from "../utils/RabbitMQConnection";
import { User } from "../models/User";
import { log } from "console";

export class UserController {

    constructor(queueName: string) {
        RabbitMQConnection.queueName = queueName;
    }

    public async initRabbitMQConnection(url: string) {
        log("CONTOLLER properties while initializing the rabbitMQSender: \n","QUEUE NAME \n", RabbitMQConnection.queueName, '\n');
        await RabbitMQConnection.init(url, RabbitMQConnection.queueName!).catch(error => {
            log("Failed to initialize the connection: ", error);
            process.exit(1);
        })
    
        log("RABBITMQ CONNECTION is initialized, QUEUE NAME IS ", RabbitMQConnection.queueName);
    }

    public async sendMessage(req: Request, res: Response) {
        try {
            const { name, surname, password, birthday } = await req.body;
            const user = new User(name, surname, password, birthday);
            const userInformaition =
                name + " " + surname + " " + password + " " + birthday;
            RabbitMQConnection.sendMessage(userInformaition, RabbitMQConnection.queueName!);
            res.sendStatus(200);
        } catch (error) {
            log("HERE: problem with sending message in the controller \n", error);
            res.sendStatus(500);
        }
    }
}