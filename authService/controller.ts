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
        console.log(username)
        verifyUser(username, password)
            .then((result: ResultLog) => {
                res.status(result.completed ? 200 : 401).send({status: result.completed, msg: result.output});
            }).catch(err => res.status(500).json(err));
    },
    signUp(req: Request<User>, res: Response) {
        const username = req.body.username,
            password = req.body.password,
            name = req.body.name,
            surname = req.body.surname;

        addUser(username, password, name, surname)
            .then((result: User | null) => {
                if (result) {
                    res.send({status: true, msg: "User was succesfully created"});
                } else {
                    res.status(409).send({status: false, msg: "User was not created"});
                }
            }).catch(err => res.status(500).json(err));
    },
    profile(req: Request<SignObject>, res: Response) {
        const username = req.body.username;
        getUser(username)
            .then((result: User | null) => {
                res.send(result);
            }).catch(err => res.status(500).json(err));
    }
};
