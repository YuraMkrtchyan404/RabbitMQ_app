"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const Controller_1 = require("../controllers/Controller");
class UserRoutes {
    constructor(queueName) {
        this.router = (0, express_1.Router)();
        this.controller = new Controller_1.Controller();
        this.setupRoutes();
        this.queueName = queueName;
    }
    setupRoutes() {
        this.router.get('/users/:id', (req, res) => {
            this.controller.getUserMessage(req, res, this.queueName);
        });
        this.router.post('/users', (req, res) => {
            this.controller.addUserMessage(req, res, this.queueName);
        });
        this.router.put('/users/:id', (req, res) => {
            this.controller.updateUserMessage(req, res, this.queueName);
        });
        this.router.delete('/users/:id', (req, res) => {
            this.controller.deleteUserMessage(req, res, this.queueName);
        });
        this.router.get('/users', (req, res) => {
            this.controller.getUsersMessage(req, res, this.queueName);
        });
    }
    getRouter() {
        return this.router;
    }
    getController() {
        return this.controller;
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=UserRouts.js.map