import { Request, Response } from "express";
import { RabbitMQConnection } from "./RabbitMQConnection";
import { log } from "console";
import { MessagingCodes } from "./messagingcodes.enum";
import { v4 as uuidv4 } from "uuid";
import * as amqp from "amqplib"

export class MessageHandler {
    public static requestIdMap: Map<string, { req: Request; res: Response }>;

    public static async sendMessageToQueue(messageType: MessagingCodes, requestData: any, req: Request, res: Response, queueName: string): Promise<string> {
        try {
            const messageId = uuidv4();
            const message = {
                id: messageId,
                type: messageType,
                data: requestData,
            };

            await RabbitMQConnection.sendMessage(message, queueName);
            MessageHandler.setRequestData(messageId, req, res);
            return messageId;
        } catch (error) {
            log(error);
            throw new Error("Failed to send message to queue.");
        }
    }

    public static async receiveResponse(msg: amqp.ConsumeMessage) {
        const informationString: string = msg.content.toString('utf8')
        const responseJson: any = JSON.parse(informationString)
        const id = responseJson.id
        const err = responseJson.error
        const data = responseJson.data
        const messageDestination = responseJson.type
        if (err) {
            const response = MessageHandler.requestIdMap.get(id)?.res;
            if (response) {
                if(messageDestination === MessagingCodes.ADD_RESPONSE){
                    response.status(500).json({ error: err });
                }else{
                    response.status(404).json({error: err});
                }
            }
        } else {
            MessageHandler.requestIdMap.get(id)?.res.json(data)
        }
        RabbitMQConnection.channel!.ack(msg)
    }

    private static setRequestData(messageId: string, req: Request, res: Response) {
        MessageHandler.requestIdMap.set(messageId, { req, res });
    }
}
