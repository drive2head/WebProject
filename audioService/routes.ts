import {Request, Response, Router} from "express"
import {AudioController} from "./controller";
import {Record} from "./types";
// import {SignObject} from "./types";

const AudioRouter = Router();

AudioRouter.get('/records', (req: Request, res: Response) => {
    AudioController.getAllRecords(req, res)
});

AudioRouter.post('/records', (req: Request<Record>, res: Response) => {
    AudioController.addRecord(req, res)
});

export default AudioRouter
