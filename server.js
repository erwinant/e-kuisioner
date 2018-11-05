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
// API file for interacting with api route
const api_trx = require('./server/routes/api_trx');

//fileupload
//app.use(fileUpload());



// Parsers
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
// API location route

//secure the api with auth
// var auth = function (req, res, next) {
//     let uri = String(req.originalUrl);
//     if (uri.indexOf('/um/users/login') >= 0 || uri.indexOf('/um/users/register') >= 0)
//         next();
//     else {
//         var token = req.headers['x-access-token'];
//         if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//         jwt.verify(token, "lumixgm1", function (err, decoded) {
//             if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//             next();
//         });
//     }
// }
// app.use(auth);

//our route
app.use('/api', api_trx);
app.use(timeout('150s'));
app.use(haltOnTimedout);
function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});



//Set Port
const port = '3003';
app.set('port', port);
http.globalAgent.maxSockets = Infinity;
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));