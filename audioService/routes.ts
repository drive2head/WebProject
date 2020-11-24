import {Request, Response, Router} from "express"
// import {SignObject} from "./types";
import {AuthController} from "./controller";

const AudioRouter = Router();

AudioRouter.get('/records', (req: Request, res: Response) => {
    res.send(AuthController.getAllRecords(req, res))
});

export default AudioRouter
