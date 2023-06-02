import { Router } from 'express';
import { UserController } from '../controllers/UserController';


export class UserRoutes {
    private router: Router;
    private userController: UserController;
    
    constructor(queueName: string) {
        this.router = Router();
        this.userController = new UserController(queueName);
        this.setupRoutes();
    }
    
    private setupRoutes() {
        this.router.get('/users', this.userController.getUserMessage);
        this.router.post('/users', this.userController.addUserMessage);
        this.router.put('/users', this.userController.updateUserMessage);
        this.router.delete('/users', this.userController.deleteUserMessage);
    }
    
    public getRouter() {
        return this.router;
    }
    
    public getUserController(){
        return this.userController;
    }
}