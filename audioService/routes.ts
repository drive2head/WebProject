import {Request, Response, Router} from "express"
import {AudioController} from "./controller";
import {Record} from "./types";
// import {SignObject} from "./types";

const AudioRouter = Router();

AudioRouter.get('/records', (req: Request, res: Response) => {
    res.send(AudioController.getAllRecords(req, res))
});

AudioRouter.post('/records', (req: Request<Record>, res: Response) => {
    res.send(AudioController.addRecord(req, res))
});

export default AudioRouter
