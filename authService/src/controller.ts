import {Controller, Get, Middleware, Post} from "@overnightjs/core";
import {Request, Response} from "express";
import {IUser, UserModel} from "./model";
import auth from "./config/auth";
import passport from "passport";
import mongoose from "mongoose";
import StatusCodes from 'http-status-codes';
import {loginValidation} from "./config/validation";

@Controller('auth')
export class AuthController {

    @Post('signup')
    @Middleware(loginValidation)
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
    @Middleware(loginValidation)
    private signIn(req: Request, res: Response) {
        const { body: { user } } = req;
        if(!user.username || !user.password) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }

        UserModel.findOne({username: user.username}, (err, userFromDB) => {
            if (err) return res.status(StatusCodes.BAD_REQUEST).json(err)
            if (userFromDB) {
                if (userFromDB.validatePassword(user.password)) return res.json({user: userFromDB.toAuthJSON()})
                else return res.sendStatus(StatusCodes.BAD_REQUEST)
            }
            else return res.sendStatus(StatusCodes.BAD_REQUEST)
        })
    }

    @Get('users')
    @Middleware(passport.authenticate('jwt', {session: false}))
    // @Middleware(oauth2orize.token()))
    private getUsers(req: Request, res: Response) {
        // const userRole = req.query.role as string || '';
        return UserModel.find()
            .then((users: Array<mongoose.Document | IUser | null>) => {
                if(!users) { return res.sendStatus(StatusCodes.BAD_REQUEST) }
                return res.json({ users: users });
            }).catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }

    @Get('user/:id')
    @Middleware(passport.authenticate('jwt', {session: false}))
    private getUser(req: Request, res: Response) {
        return UserModel.findById(req.params.id)
            .then((user: mongoose.Document | IUser | null) => {
                if(!user) { return res.sendStatus(StatusCodes.BAD_REQUEST) }
                return res.json({ user: user });
            }).catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }
}
