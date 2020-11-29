import * as mongoose from "mongoose";
import {audio_db_uri} from "./cfg";
import {createConnection, Document, Schema} from "mongoose";
import {Record} from "./types";
import {recordSchema} from "./model";
const ObjectId = mongoose.Schema.Types.ObjectId;

function connect() {
    return createConnection(audio_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
}

export async function getAllRecords(): Promise<Record[]> {
    const audio_connections = connect()
    try {
        const Record = audio_connections.model<Record>('Record', recordSchema);

        return await Record.find();
    } finally {
        audio_connections.close();
    }
}

async function findRecordByName (name: string) {
    const audio_connections = connect()
    try {
        const Record = audio_connections.model<Record>('Record', recordSchema);
        return await Record.findOne({ name: name });
    } finally {
        audio_connections.close();
    }
}

export async function addRecord(name: string, path: string, speakerId: mongoose.Types.ObjectId): Promise<Document | null> {
    const audio_connections = connect()
    try {
        const Record = audio_connections.model<Record>('Record', recordSchema);

        const record = await findRecordByName(name);
        if (record) {
            return null;
        }
        let newRecord = new Record({ name: name, path: path, speakerID: speakerId });
        newRecord = await newRecord.save();
        return newRecord;
    } catch (err) {
        return null
    } finally {
        audio_connections.close();
    }
}
