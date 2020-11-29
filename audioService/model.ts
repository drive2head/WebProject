import * as mongoose from "mongoose";
import {Schema} from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

export const recordSchema = new Schema({
    path: String,
    name: String,
    speakerId: ObjectId,
});
export const Record = mongoose.model("users", recordSchema);
