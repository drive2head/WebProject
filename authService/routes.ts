import {Request, Response, Router} from "express"
import {SignObject} from "./types";
import {AuthController} from "./controller";

const AuthRouter = Router();

AuthRouter.post('/signin', (req: Request<SignObject>, res: Response) => {
    AuthController.signIn(req, res)
});

AuthRouter.post('/signup', (req: Request<SignObject>, res: Response) => {
    AuthController.signUp(req, res)
});

AuthRouter.get('/profile', (req: Request<SignObject>, res: Response) => {
    AuthController.profile(req, res)
});

export default AuthRouter
