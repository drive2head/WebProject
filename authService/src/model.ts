import {User} from './types';
import {Schema} from "mongoose";
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import env from './helpers/dotenv-conf'
import fs from 'fs'
env()

mongoose.connect(process.env.DB_PATH as string, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true } );

interface IUser extends mongoose.Document{
    username: string
    hashedPassword: string
    role: string
    name: string
    surname: string
    salt: string
    setPassword(password: string): void
    validatePassword(password: string): boolean
    generateJWT(): any
    toAuthJSON(): any
}

export { IUser }

const NewUser = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum : ['user', 'admin'],
        default: 'user'
    },
    name: String,
    surname: String,
    salt: {
        type: String,
        required: true
    }
});

NewUser.virtual('userId').get(function (this: any) {return this.id});
NewUser.methods.setPassword = function(password: string) {
    this.salt = bcrypt.genSaltSync();
    this.hashedPassword = bcrypt.hashSync(password, this.salt)
};

NewUser.methods.validatePassword = function(password: string) {
    return bcrypt.compareSync(password, this.hashedPassword);
};

NewUser.methods.generateJWT = function() {
    const expirationDate = new Date();
    expirationDate.setMilliseconds(expirationDate.getMilliseconds() + +process.env.JWT_TOKEN_LIFE!);

    // const privateKEY  = fs.readFileSync('./private.key', 'utf8');
    const publicKEY  = fs.readFileSync('./public.key', 'utf8');
    console.log(publicKEY)

    console.log(new Date(), expirationDate)
    return jwt.sign({
        username: this.username,
        id: this._id,
        exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
    }, publicKEY, { algorithm: 'RS256' });
}

NewUser.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJWT(),
    };
};

const UserModel = mongoose.model<IUser>('User', NewUser);

const Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

const ClientModel = mongoose.model('Client', Client);

// AccessToken
const AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const AccessTokenModel = mongoose.model('AccessToken', AccessToken);

// RefreshToken
const RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const RefreshTokenModel = mongoose.model('RefreshToken', RefreshToken);

export {UserModel, ClientModel, AccessTokenModel, RefreshTokenModel};
