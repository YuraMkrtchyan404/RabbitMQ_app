"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const messagingcodes_enum_1 = require("../utils/messagingcodes.enum");
const MessageHandler_1 = require("../utils/MessageHandler");
class UserController {
    constructor() {
        MessageHandler_1.MessageHandler.requestIdMap = new Map();
    }
    async getUserMessage(req, res, queueName) {
        await MessageHandler_1.MessageHandler.sendMessageToQueue(messagingcodes_enum_1.MessagingCodes.GET_USER, { id: req.params.id }, req, res, queueName);
    }
    async getUsersMessage(req, res, queueName) {
        await MessageHandler_1.MessageHandler.sendMessageToQueue(messagingcodes_enum_1.MessagingCodes.GET_USERS, {}, req, res, queueName);
    }
    async addUserMessage(req, res, queueName) {
        await MessageHandler_1.MessageHandler.sendMessageToQueue(messagingcodes_enum_1.MessagingCodes.ADD_USER, { ...req.body }, req, res, queueName);
    }
    async updateUserMessage(req, res, queueName) {
        await MessageHandler_1.MessageHandler.sendMessageToQueue(messagingcodes_enum_1.MessagingCodes.UPDATE_USER, { ...req.body, id: req.params.id }, req, res, queueName);
    }
    async deleteUserMessage(req, res, queueName) {
        await MessageHandler_1.MessageHandler.sendMessageToQueue(messagingcodes_enum_1.MessagingCodes.DELETE_USER, { id: req.params.id }, req, res, queueName);
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map