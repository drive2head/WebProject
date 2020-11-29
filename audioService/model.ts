import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export const recordSchema = new Schema({
    path: String,
    name: String,
    speakerId: mongoose.Types.ObjectId,
});
export const Record = mongoose.model("users", recordSchema);
