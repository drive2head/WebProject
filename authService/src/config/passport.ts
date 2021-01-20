import passport from 'passport'
import {UserModel} from "../model";
import dotenv from '../helpers/dotenv-conf'
import JwtStrategy from 'passport-jwt'
dotenv()

export function usePassport() {
    passport.use(new JwtStrategy.Strategy(
        {jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_PRIVATE},
        (jwt_payload, done) => {
            UserModel.findOne({id: jwt_payload.sub}, (err, user) => {
                if (err) return done(err, false)
                if (user) return done(null, user)
                else return done(null, false)
            })
    }))
}
