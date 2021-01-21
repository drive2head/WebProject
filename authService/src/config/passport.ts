import passport from 'passport'
import {ClientModel, UserModel} from "../model";
import dotenv from '../helpers/dotenv-conf'
import JwtStrategy from 'passport-jwt'
import fs from "fs";
import path from "path";
dotenv()
const publicKEY  = fs.readFileSync(path.join(__dirname,'../public.key'));

export function usePassport() {
    passport.use(new JwtStrategy.Strategy(
        {jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: publicKEY},
        (jwt_payload, done) => {
            ClientModel.findOne({id: jwt_payload.sub}, (err, client) => {
                if (err) return done(err, false)
                if (client) return done(null, client)
                else return done(null, false)
            })
    }))
}
