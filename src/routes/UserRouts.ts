import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { log } from 'console';


export class UserRoutes {
    public router: Router;
    private userController: UserController;
    
    constructor(queueName: string) {
        this.router = Router();
        this.userController = new UserController(queueName);
        this.setupRoutes();
        log("ROUTER after being inited: \n", this)
    }
    
    private setupRoutes() {
        console.log("Setting up the router \n")
        this.router.post('/users', this.userController.sendMessage);
    }
    
    
    public getRouter() {
        return this.router;
    }
    
    public getUserController(){
        return this.userController;
    }
}