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
        /**
         * @openapi
         * /users/register:
         *  post:
         *      tags:
         *          - Users
         *      summary: Resgister a user
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/CreateUserInput'
         *      responses:
         *          200:
         *              description: Successful registration.
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/LoginUserResponse'
         *          400:
         *              description: Invalid request data.
         *          404:
         *              description: Not Found
         *          500:
         *              description: Internal server error.
         */
        this.router.post('/users/register', this.controller.registerUserMessage)
        /**
         * @openapi
         * /users/login:
         *  post:
         *      tags:
         *          - Users
         *      summary: Log in a user
         *      requestBody:
         *          description: User login credentials
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#/components/schemas/LoginUserInput'
         *      responses:
         *          200:
         *              description: Successful login.
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/LoginUserResponse'
         *          400:
         *              description: Invalid request data.
         *          404:
         *              description: Not Found
         *          500:
         *              description: Internal server error.
         */
        this.router.post('/users/login', this.controller.loginUserMessage)
        /**
         * @swagger
         * /users/{id}:
         *   get:
         *     summary: Get a user by ID.
         *     tags: [Users]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: integer
         *         required: true
         *         description: User ID.
         *     responses:
         *       200:
         *         description: Successful operation.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         *       401:
         *         description: Unauthorized access.
         *       404:
         *         description: User not found.
         *       500:
         *         description: Internal server error.
         */
        this.router.get('/users/:id', AuthenticateMiddleware.authenticate, this.controller.getUserMessage)
        /**
         * @openapi
         * /users:
         *  get:
         *    tags:
         *      - Users
         *    summary: Get all users
         *    description: Gets all users
         *    responses:
         *      200:
         *        description: Successful operation
         *        content:
         *          application/json:
         *            schema:    
         *              type: array
         *              items:
         *                $ref: '#/components/schemas/User'
         *      401:
         *        description: Unauthorized access
         *      500:
         *        description: Internal server error
         */
        this.router.get('/users', AuthenticateMiddleware.authenticate, this.controller.getUsersMessage)
        /**
         * @swagger
         * /users/{id}:
         *   put:
         *     summary: Update a user by ID.
         *     tags: 
         *       - Users
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: integer
         *         required: true
         *         description: User ID.
         *     requestBody:
         *       description: Updated user data.
         *       required: false
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateUserInput'
         *     responses:
         *       200:
         *         description: Successful operation.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         *       400:
         *         description: Invalid request data.
         *       401:
         *         description: Unauthorized access.
         *       404:
         *         description: User not found.
         *       500:
         *         description: Internal server error.
         */
        this.router.put('/users/:id', AuthenticateMiddleware.authenticate, this.controller.updateUserMessage)
        /**
         * @swagger
         * /users/{id}:
         *   delete:
         *     summary: Delete a user by ID.
         *     tags: 
         *       - Users
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: integer
         *         required: true
         *         description: User ID.
         *     responses:
         *       200:
         *         description: Successful operation.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/User'
         *       401:
         *         description: Unauthorized access.
         *       404:
         *         description: User not found.
         *       500:
         *         description: Internal server error.
         */
        this.router.delete('/users/:id', AuthenticateMiddleware.authenticate, this.controller.deleteUserMessage)
    }
}
