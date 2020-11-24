import {getAllRecords} from "./service";
import {Request, Response} from "express";

interface audioController {
    getAllRecords(req: Request, res: Response): void
}

export const AuthController: audioController = {

    async getAllRecords() {
        return await getAllRecords()
    }
//
// /**
//  * Функция возвращает запись по названию.
//  * @param {string} name название записи.
//  * @returns {object} запись из базы.
//  */
// async function findRecordByName (name) {
//     try {
//         var users_connection = mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
//         var Record = users_connection.model('Record', recordSchema);
//
//         return await Record.findOne({ name: name });
//     } finally {
//         users_connection.close();
//     }
// };
// /**
//  * Функция добавляет запись в базу.
//  * @param {string} name название записи.
//  * @param {string} path путь к аудиозаписи.
//  * @param {int} speakerID id диктора.
//  * @returns {object} успех или неуспех операции.
//  */
// async function addRecord(name, path, speakerID) {
//     try {
//         var users_connection = mongoose.createConnection(cfg.records_db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
//         var Record = users_connection.model('Record', recordSchema);
//
//         var record = await findRecordByName(name);
//         if (record) {
//             return { completed: false, output: `This record name is already in use` };
//         }
//         var newRecord = new Record({ name: name, path: path, speakerID: speakerID });
//         newRecord = await newRecord.save();
//         return { completed: true, output: newRecord };
//     } catch (err) {
//         return { completed: false, output: err };
//     } finally {
//         users_connection.close();
//     }
// };
//
// exports.findRecordByName = findRecordByName;
// exports.addRecord = addRecord;
// exports.getAllRecords = getAllRecords;
};
