import {Controller, Get, Middleware, Post} from "@overnightjs/core";
import {NextFunction, Request, Response} from "express";
import {IUser, UserModel} from "./model";
import auth from "./config/auth";
import passport from "passport";
import mongoose from "mongoose";
import StatusCodes from 'http-status-codes';

@Controller('auth')
export class AuthController {

    @Post('signup')
    @Middleware(auth.optional)
    private signUp(req: Request, res: Response) {
        const { body: { user } } = req;
        if(!user.username || !user.password) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }

        const newUser = new UserModel(user) as IUser;
        newUser.setPassword(user.password);
        return newUser.save()
            .then(() => res.status(StatusCodes.CREATED).json({ user: newUser.toAuthJSON() }))
            .catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }

    @Post('signin')
    @Middleware(auth.optional)
    private signIn(req: Request, res: Response, next: NextFunction) {
        const { body: { user } } = req;
        if(!user.username || !user.password) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }

        return passport.authenticate('local', { session: false }, (err, passportUser) => {
            if(passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                return res.json({ user: user.toAuthJSON() });
            }

            if(err) {
                return next(err);
            }

            return res.sendStatus(StatusCodes.BAD_REQUEST);

        })(req, res, next);
    }

    @Get('users')
    @Middleware(auth.required)
    private getUsers(req: Request, res: Response) {
        // const userRole = req.query.role as string || '';
        return UserModel.find()
            .then((users: Array<mongoose.Document | IUser | null>) => {
                if(!users) { return res.sendStatus(StatusCodes.BAD_REQUEST) }
                return res.json({ users: users });
            }).catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }

    @Get('user/:id')
    @Middleware(auth.required)
    private getUser(req: Request, res: Response) {
        return UserModel.findById(req.params.id)
            .then((user: mongoose.Document | IUser | null) => {
                if(!user) { return res.sendStatus(StatusCodes.BAD_REQUEST) }
                return res.json({ user: user });
            }).catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }
}
