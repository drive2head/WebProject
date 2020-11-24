import * as mongoose from "mongoose";
import {audio_db_uri} from "./cfg";
import {createConnection, Document, Schema} from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

function connect() {
    return createConnection(audio_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
}

const recordSchema = new Schema({
    name: String,
    path: String,
    speakerID: ObjectId
});

export async function getAllRecords(): Promise<Document[]> {
    const users_connection = connect()
    try {
        const Record = users_connection.model('Record', recordSchema);

        return await Record.find();
    } finally {
        users_connection.close();
    }
}
