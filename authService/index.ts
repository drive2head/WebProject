import express from "express"
import AuthRouter from "./routes"
import Morgan from "morgan"

// console.log(morgan)
const app = express();

app.use(Morgan('combined'));
app.use(express.urlencoded());
app.use(express.json());
app.use(AuthRouter);
app.get('/', (req, res) => res.sendStatus(404));

const port = process.env.PORT || 1488;
const server = app.listen(port, () => console.log(`Listening on: ${port}`));

module.exports = server;
