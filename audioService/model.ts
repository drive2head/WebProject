import * as mongoose from "mongoose";
import {Schema, Types} from "mongoose";

export const recordSchema = new Schema({
    path: String,
    name: String,
    speakerId: Types.ObjectId,
});
