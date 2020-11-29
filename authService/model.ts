import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
});
