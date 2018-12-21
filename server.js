const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const http = require('http');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const timeout = require('connect-timeout'); //express v4



//Cors
app.use(cors());
app.options('*', cors());
app.set('views', 'server/views');
app.set('view engine', 'pug');

// API file for interacting with api route
const api_trx = require('./server/routes/api_trx');

// Parsers
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
//our route
app.use('/api', api_trx);
app.use(timeout('8000s'));
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

// Send all other requests to the Angular app




//Set Port
const port = '3003';
app.set('port', port);
http.globalAgent.maxSockets = Infinity;
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));