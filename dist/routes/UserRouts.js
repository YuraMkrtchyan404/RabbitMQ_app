"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
class UserRoutes {
    constructor(queueName) {
        this.router = (0, express_1.Router)();
        this.userController = new UserController_1.UserController(queueName);
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get('/users/:id', this.userController.getUserMessage);
        this.router.post('/users', this.userController.addUserMessage);
        this.router.put('/users/:id', this.userController.updateUserMessage);
        this.router.delete('/users/:id', this.userController.deleteUserMessage);
    }
    getRouter() {
        return this.router;
    }
    getUserController() {
        return this.userController;
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=UserRouts.js.map