import {Request, Response, Router} from "express"
import {SignObject} from "./types";
import {AuthController} from "./controller";
import {body, validationResult} from "express-validator"

const AuthRouter = Router();

AuthRouter.post('/signin',
    body('username').isEmail(),
    body('username').isLength({min: 4}),
    body('password').isLength({min: 6}),
    (req: Request<SignObject>, res: Response) => {
        const errors = validationResult(req);
        console.log("hey, ", errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        AuthController.signIn(req, res)
});

AuthRouter.post('/signup',
    body('username').isEmail(),
    body('username').isLength({min: 4}),
    body('password').isLength({min: 6}),
    body('name').notEmpty(),
    body('surname').notEmpty(),
    (req: Request<SignObject>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        AuthController.signUp(req, res)
});

AuthRouter.post('/profile',
    body('username').isEmail(),
    body('username').isLength({min: 4}),
    (req: Request<SignObject>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }
        AuthController.profile(req, res)
});

export default AuthRouter
