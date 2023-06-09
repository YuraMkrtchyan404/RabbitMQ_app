import { Request, Response, NextFunction, response } from 'express';
import bcrypt from 'bcrypt';
import { log } from 'console';

export class PasswordHashingMiddleware {
    public static async hashPassword(req: Request, res: Response, next: NextFunction) {
        try {
            log(req.body.password)
            if (req.method === 'POST' || req.method === 'PUT') {
                const password: string = req.body.password;
                if (password) {

                    const hashedPassword: string = await bcrypt.hash(password, 10);
                    req.body.password = hashedPassword;

                }
            }
            next();
        } catch (error) {
            log(error)
            const response = res
            if (response) {
                response.status(500).json({ error: error })
            }
        }
    };
}
