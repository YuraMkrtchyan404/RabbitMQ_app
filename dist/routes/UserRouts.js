"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const console_1 = require("console");
class UserRoutes {
    constructor(queueName) {
        this.router = (0, express_1.Router)();
        this.userController = new UserController_1.UserController(queueName);
        this.setupRoutes();
        (0, console_1.log)("ROUTER after being inited: \n", this);
    }
    setupRoutes() {
        console.log("Setting up the router \n");
        this.router.post('/users', this.userController.sendMessage);
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