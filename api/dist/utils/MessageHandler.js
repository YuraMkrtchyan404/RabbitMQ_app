"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const RabbitMQConnection_1 = require("./RabbitMQConnection");
const console_1 = require("console");
const uuid_1 = require("uuid");
class MessageHandler {
    static async sendMessageToQueue(messageType, requestData, req, res, queueName) {
        try {
            const messageId = (0, uuid_1.v4)();
            const message = {
                id: messageId,
                type: messageType,
                data: requestData,
            };
            await RabbitMQConnection_1.RabbitMQConnection.sendMessage(message, queueName);
            MessageHandler.setRequestData(messageId, req, res);
            return messageId;
        }
        catch (error) {
            (0, console_1.log)(error);
            throw new Error("Failed to send message to queue.");
        }
    }
    static async receiveResponse(msg) {
        var _a, _b;
        const informationString = msg.content.toString('utf8');
        const responseJson = JSON.parse(informationString);
        const id = responseJson.id;
        const err = responseJson.error;
        const data = responseJson.data;
        if (err) {
            const response = (_a = MessageHandler.requestIdMap.get(id)) === null || _a === void 0 ? void 0 : _a.res;
            if (response) {
                response.status(404).json({ error: err });
            }
        }
        else {
            (_b = MessageHandler.requestIdMap.get(id)) === null || _b === void 0 ? void 0 : _b.res.json(data);
        }
        RabbitMQConnection_1.RabbitMQConnection.channel.ack(msg);
    }
    static setRequestData(messageId, req, res) {
        MessageHandler.requestIdMap.set(messageId, { req, res });
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map