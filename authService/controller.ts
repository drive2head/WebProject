import {SignObject, ResultLog, User} from "./types";
import {Request, Response} from "express";
import {verifyUser, addUser, getUser} from "./service";

interface authController {
    signIn(req: Request<SignObject>, res: Response): void
    signUp(req: Request<SignObject>, res: Response): void
    profile(req: Request<SignObject>, res: Response): void
}

export const AuthController: authController = {
    signIn(req: Request<SignObject>, res: Response) {
        const username = req.body.username,
            password = req.body.password;

        verifyUser(username, password)
            .then((result: ResultLog) => {
                res.send({status: result.completed, msg: result.output});
            });
    },
    signUp(req: Request<User>, res: Response) {
        const username = req.body.username,
            password = req.body.password,
            name = req.body.name,
            surname = req.body.surname;

        addUser(username, password, name, surname)
            .then((result: User | null) => {
                res.send(result);
            })
    },
    profile(req: Request<SignObject>, res: Response) {
        const username = req.body.username;
        getUser(username)
            .then((result: User | null) => {
                res.send(result);
            });
    }
};
