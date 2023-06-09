import { Router } from 'express'
import { Controller } from '../controllers/Controller'


export class UserRoutes {
    private router: Router
    private controller: Controller
    private queueName: string;

    constructor(queueName: string) {
        this.router = Router()
        this.controller = new Controller()
        this.setupRoutes()
        this.queueName = queueName
    }

    private setupRoutes() {
        this.router.get('/users/:id', (req, res) => {
            this.controller.getUserMessage(req, res, this.queueName)
        })
        this.router.post('/users', (req, res) => {
            this.controller.addUserMessage(req, res, this.queueName)
        })
        this.router.put('/users/:id', (req, res) => {
            this.controller.updateUserMessage(req, res, this.queueName)
        })
        this.router.delete('/users/:id', (req, res) => {
            this.controller.deleteUserMessage(req, res, this.queueName)
        })
        this.router.get('/users', (req, res) => {
            this.controller.getUsersMessage(req, res, this.queueName)
        })
    }

    public getRouter() {
        return this.router
    }

    public getController() {
        return this.controller
    }
}