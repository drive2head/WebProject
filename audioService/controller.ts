import {addRecord, getAllRecords} from "./service";
import {Request, Response} from "express";
import {Record} from "./types";

interface audioController {
    getAllRecords(req: Request, res: Response): void
    addRecord(req: Request<Record>, res: Response): void
}

export const AudioController: audioController = {

    getAllRecords(req: Request, res: Response) {
        getAllRecords()
            .then(payload => res.send(payload))
    },
    addRecord(req: Request<Record>, res: Response) {
        const name = req.body.name,
            path = req.body.path,
            speakerId = req.body.speakerId;
        addRecord(name, path, speakerId)
            .then(payload => res.send(payload))
    }
}
