const express = require('express');
const GraphRouter = require('./router');

const bodyParser = require('body-parser')
const Morgan = require('morgan')
const app = express();
const port = 7777;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(Morgan('combined'))
app.use(GraphRouter)

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
