const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const utils = require("./utils/utils");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Routes

app.use('/' , require('./controllers/api'))

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
    utils.checkForMissedWebHooks()
})

module.exports = app