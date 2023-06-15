import { Router } from 'express'
import { Controller } from '../controllers/UserController'
import { AuthenticateMiddleware } from '../middlewares/Authenticate.middleware'

export class UserRoutes {
    private router: Router
    private controller: Controller

    constructor() {
        this.router = Router()
        this.controller = new Controller()
        this.setupRoutes()
    }

    public getRouter() {
        return this.router
    }

    public getController() {
        return this.controller
    }

    private setupRoutes() {
        this.router.post('/users/register', this.controller.registerUserMessage)
        this.router.post('/users/login', this.controller.loginUserMessage)
        this.router.get('/users/:id', AuthenticateMiddleware.authenticate, this.controller.getUserMessage)
        this.router.get('/users', AuthenticateMiddleware.authenticate, this.controller.getUsersMessage)
        this.router.put('/users/:id', AuthenticateMiddleware.authenticate, this.controller.updateUserMessage)
        this.router.delete('/users/:id', AuthenticateMiddleware.authenticate, this.controller.deleteUserMessage)
    }
}