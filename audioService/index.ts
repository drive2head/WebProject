import express from 'express'
import AudioRouter from "./routes"
import Morgan from "morgan"

const app = express();

app.use(Morgan('combined'));
app.use(express.urlencoded());
app.use(express.json());
app.use(AudioRouter);

const port = process.env.PORT || 1337;
const server = app.listen(port, () => console.log(`Port: ${port}`));

module.exports = server;

