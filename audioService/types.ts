import * as mongoose from "mongoose";

export interface ResultLog {
    completed: boolean
    output: string
}

export interface Record {
    name: string
    path: string
    speakerID: mongoose.Types.ObjectId
}
