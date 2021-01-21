import {Controller, Get, Middleware, Post} from "@overnightjs/core";
import {Request, Response} from "express";
import {AccessTokenModel, ClientModel, RefreshTokenModel, IClient, IUser, UserModel} from "./model";
import auth from "./config/auth";
import passport from "passport";
import mongoose from "mongoose";
import StatusCodes from 'http-status-codes';
import crypto from 'crypto'
import {loginValidation} from "./config/validation";
import {exchange} from "oauth2orize";
import refreshToken = exchange.refreshToken;

@Controller('')
export class AuthController {

    @Post('signup')
    @Middleware(loginValidation)
    private signUp(req: Request, res: Response) {
        // const { body: { user } } = req;
        const { body: { username, password } } = req;
        const user = {username, password}
        if(!user.username || !user.password) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }

        const newUser = new UserModel(user) as IUser;
        newUser.setPassword(user.password);
        return newUser.save()
            .then(() => res.status(StatusCodes.CREATED).json({ user: newUser.toAuthJSON() }))
            .catch(err => res.status(StatusCodes.SERVICE_UNAVAILABLE).json(err));
    }

    @Post('signin')
    // @Middleware(loginValidation)
    private signIn(req: Request, res: Response) {
        // const { body: { user } } = req;
        const { body: { username, password } } = req;
        const user = {username, password}

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

    @Post('refresh')
    private refresh(req: Request, res: Response) {
        const { body: { refreshToken } } = req;
        RefreshTokenModel.findOne({token: refreshToken}, (err, token) => {
            if (err) return res.sendStatus(StatusCodes.UNAUTHORIZED)
            if (token) {
                ClientModel.findOne({_id: token.clientId}, (err, client) => {
                    if (err) return res.sendStatus(StatusCodes.UNAUTHORIZED)
                    if (client) {
                        const userId = token.userId
                        RefreshTokenModel.deleteOne({clientId: token.clientId})
                        AccessTokenModel.deleteOne({clientId: token.clientId})
                        const tokenValue = client.generateJWT()
                        const refreshTokenValue = crypto.randomBytes(32).toString('base64');
                        const accessToken = new AccessTokenModel({ token: tokenValue, clientId: client.id, userId: userId })
                        const refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.id, userId: userId });
                        refreshToken.save().then(refresh => {
                            accessToken.save().then(token => res.json({token: token.token, refreshToken: refresh.token, client: userId}))
                        });
                    }
                    return res.sendStatus(StatusCodes.BAD_REQUEST)
                })
            }
            else res.sendStatus(StatusCodes.BAD_REQUEST)
        })
    }

    @Post('oauth')
    @Middleware(loginValidation)
    private oauth(req: Request, res: Response) {
        const { body: { user } } = req;
        const { body: { client }} = req

        if(!user.username || !user.password) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }
        if (!client.name) { return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY) }

        UserModel.findOne({username: user.username}, (err, userFromDB) => {
            if (err) return res.status(StatusCodes.BAD_REQUEST).json(err)
            if (userFromDB) {
                if (userFromDB.validatePassword(user.password)) {
                    ClientModel.findOne({name: client.name}, (err, clientFromDB) => {
                        if (err) return res.sendStatus(StatusCodes.BAD_REQUEST)
                        if (clientFromDB) {
                            RefreshTokenModel.findOne({ clientId: clientFromDB.id }, (err, refresh) => {
                                if (refresh) {
                                    AccessTokenModel.findOne({ clientId: clientFromDB.id }, (err, token) => {
                                        if (token) res.json({token: token.token, refreshToken: refresh.token, client: clientFromDB})
                                        else res.sendStatus(StatusCodes.BAD_REQUEST)
                                    })
                                } else res.sendStatus(StatusCodes.BAD_REQUEST)
                            })
                        }
                        else {
                            new ClientModel({name: client.name}).save().then((newClient: IClient | null) => {
                                if (!newClient) return res.sendStatus(StatusCodes.BAD_REQUEST)
                                const tokenValue = newClient.generateJWT()
                                const refreshTokenValue = crypto.randomBytes(32).toString('base64');
                                const accessToken = new AccessTokenModel({ token: tokenValue, clientId: newClient.id, userId: userFromDB.id })
                                const refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: newClient.id, userId: userFromDB.id });
                                refreshToken.save().then(refresh => {
                                    accessToken.save().then(token => res.json({token: token.token, refreshToken: refresh.token, client: newClient}))
                                });
                            })
                        }
                    })
                }
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
