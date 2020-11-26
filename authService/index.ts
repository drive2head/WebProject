import express from 'express'
import AuthRouter from "./routes"
import Morgan from "morgan"

const app = express();

app.use(Morgan('combined'));
app.use(express.urlencoded());
app.use(express.json());
app.use(AuthRouter);

const port = process.env.PORT || 1488;
const server = app.listen(port, () => console.log(`Listening on: ${port}`));

module.exports = server;