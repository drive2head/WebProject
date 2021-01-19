import jwt from "express-jwt";
import {Request} from "express";
import env from '../helpers/dotenv-conf'
import {Logger} from "@overnightjs/logger";
env()

const getTokenFromHeaders = (req: Request) => {
    const { headers: { authorization } } = req;
    if(authorization && authorization.split(' ')[0] === 'Bearer') {

        return authorization.split(' ')[1];
    }
    return null;
};

export default {
    required: jwt({
        secret: process.env.JWT_SECRET!,
        algorithms: ['HS256'],
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: process.env.JWT_SECRET!,
        userProperty: 'payload',
        algorithms: ['HS256'],
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};
