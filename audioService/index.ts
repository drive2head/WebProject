import express from 'express'
import AudioRouter from "./routes"
import Morgan from "morgan"

const app = express();

app.use(Morgan('combined'));
app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 1488;
app.listen(port, () => console.log(`Port: ${port}`));
app.use(AudioRouter);
