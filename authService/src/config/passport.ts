import mongoose from 'mongoose'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import {IUser, UserModel} from "../model";

export function usePassport() {
        passport.use(new LocalStrategy.Strategy({
            usernameField: 'user[username]',
            passwordField: 'user[password]',
        }, (username: string, password: string, done: any) => {
            UserModel.findOne({username})
                .then((user: mongoose.Document | null) => {
                    if (!user || !(user as IUser).validatePassword(password)) {
                        return done(null, false, {errors: {'username or password': 'is invalid'}});
                    }
                    return done(null, user);
                }).catch(done);
        }));
    }
