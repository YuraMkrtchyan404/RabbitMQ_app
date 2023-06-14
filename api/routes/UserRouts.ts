import { Router } from 'express'
import { Controller } from '../controllers/UserController'
import { AuthenticateMiddleware } from '../middlewares/Authenticate.middleware'

export class UserRoutes {
    private router: Router
    private controller: Controller
    private queueName: string

    constructor(queueName: string) {
        this.router = Router()
        this.controller = new Controller()
        this.queueName = queueName
        this.setupRoutes()
    }

    public getRouter() {
        return this.router
    }

    public getController() {
        return this.controller
    }

    private setupRoutes() {
        this.router.post('/users/register', (req, res) => {
            this.controller.registerUserMessage(req, res, this.queueName)
        })
        this.router.post('/users/login', (req, res) => {
            this.controller.loginUserMessage(req, res, this.queueName)
        })
        this.router.get('/users/:id', AuthenticateMiddleware.authenticate, (req, res) => {
            this.controller.getUserMessage(req, res, this.queueName)
        })
        this.router.get('/users', AuthenticateMiddleware.authenticate, (req, res) => {
            this.controller.getUsersMessage(req, res, this.queueName)
        })
        this.router.put('/users/:id', AuthenticateMiddleware.authenticate, (req, res) => {
            this.controller.updateUserMessage(req, res, this.queueName)
        })
        this.router.delete('/users/:id', AuthenticateMiddleware.authenticate, (req, res) => {
            this.controller.deleteUserMessage(req, res, this.queueName)
        })
    }
}