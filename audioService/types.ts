import * as mongoose from "mongoose";

export interface ResultLog {
    completed: boolean
    output: string
}

// export interface Record extends mongoose.Document{
//     name: string
//     path: string
//     speakerId: string
// }


export interface Record extends mongoose.Document{
    name: string
    path: string
    speakerID: mongoose.Types.ObjectId
}
