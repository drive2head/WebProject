import {Request, Response, Router} from "express"

const GraphRouter = Router();

GraphRouter.get('/', (req, res) => {
    res.send('КоляКоляНиколай');
});

export default GraphRouter
