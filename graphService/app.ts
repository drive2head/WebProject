import express from 'express';
import GraphRouter from "./router";

const app = express();
const port = 7777;

app.use(GraphRouter)

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
