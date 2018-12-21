var us = require('../models/user');
var an = require('../models/answer');
var qs = require('../models/question');
var cp = require('../models/company');

var express = require('express');
var router = express.Router();
var fs = require('fs');
const pug = require('pug');
var pdf = require('html-pdf');
const async = require('async');

//region user
router.get('/us', function (req, res, next) {
    us.getAllUser(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/us/cr/', function (req, res, next) {
    if (req.body) {
        us.getAllUserByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/us/', function (req, res, next) {
    us.insertUser(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/us/:key', function (req, res, next) {
    us.updateUser(req.params.key, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/us/:key', function (req, res, next) {
    us.deleteUser(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

//region answer
router.get('/an', function (req, res, next) {
    an.getAllAnswer(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/an/cr/', function (req, res, next) {
    if (req.body) {
        an.getAllAnswerByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/an/', function (req, res, next) {
    an.insertAnswer(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/an/:key1/:key2', function (req, res, next) {
    an.updateAnswer(req.params.key1, req.params.key2, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/an/:key1/:key2', function (req, res, next) {
    an.deleteAnswer(req.params.key1, req.params.key2, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

//region question
router.get('/qs', function (req, res, next) {
    qs.getAllQuestion(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/qs/cr/', function (req, res, next) {
    if (req.body) {
        qs.getAllQuestionByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/qs/', function (req, res, next) {
    qs.insertQuestion(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/qs/:key', function (req, res, next) {
    qs.updateQuestion(req.params.key, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/qs/:key', function (req, res, next) {
    qs.deleteQuestion(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/qsall/:key', function (req, res, next) {
    qs.deleteAllQuestion(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

//region company
router.get('/cp', function (req, res, next) {
    cp.getAllCompany(function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/cp/cr/', function (req, res, next) {
    if (req.body) {
        cp.getAllCompanyByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/cp/', function (req, res, next) {
    cp.insertCompany(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/cp/:key', function (req, res, next) {
    cp.updateCompany(req.params.key, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/cp/:key', function (req, res, next) {
    cp.deleteCompany(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/reportview', function (req, res) {
    const compiledFunction = pug.compileFile('server/views/index.pug');
    an.rpt("erwin.ant@gmail.com", "ADMEDIKA", (err, rows) => {
        res.render('index', { rows });
    });
});


router.get('/reports/:key1/:key2', function (req, res) {

    if (req.params.key1) {
        deletePdfFolder('server/views/pdf');
        us.getAllUserByCriteria({ CompanyCode: req.params.key1 }, (err1, users) => {
			
            async.eachSeries(users, (user, callback) => {
                renderPdf(user.Username, req.params.key1, (msg) => {
                    callback();
                })
            }, (err) => {
                var zipFolder = require('zip-folder');
                zipFolder('server/views/pdf', 'server/views/pdf.zip', (errZip) => {
                    if (errZip) {
                        console.log('oh no!', errZip);
                    } else {
                        var email = require("emailjs");
                        var server = email.server.connect({
                            user: "erwin.ant@experd.com",
                            password: "Sunter123",
                            host: "smtp.gmail.com",
                            ssl: true,
							port : 465,
                            timeout: 60000
                        });

                        // send the message and get a callback with an error or details of the message that was sent
                        server.send({
                            text: "Berikut data ECQ Project "+req.params.key1,
                            from: "ECQ Reporter <itsupport@experd.com>",
                            to: req.params.key2,
                            subject: "ECQ Reporter",
                            attachment:
                                [
                                    { data: "Berikut data ECQ Project "+req.params.key1, alternative: true },
                                    { path:"server/views/pdf.zip", type:"application/zip", name:"pdf.zip"}
                                ]
                        }, function (err, message) {
                            //console.log(err || message);
                            if (err) { res.json(err); }
                            else { res.send("Report telah dikirim ke email "+req.params.key2); }
                        });
                    }
                });

            });
        });
    }
    else
        res.send("What are you looking?");
});

function deletePdfFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function renderPdf(username, companyCode, callback) {
    const compiledFunction = pug.compileFile('server/views/index.pug');
    an.rpt(username, companyCode, (err, rows) => {
		
        var html = compiledFunction({ rows });
        let filename = username;
        if (username.split('@').length > 0)
            filename = username.split('@')[0] + ".pdf";
        setTimeout(() => {
            var options = {
                format: 'Letter',
                border: {
                    "top": "1.5cm",            // default is 0, units: mm, cm, in, px
                    "right": "1.5cm",
                    "bottom": "1.5cm",
                    "left": "1.5cm"
                }
            };
            pdf.create(html, options).toFile('server/views/pdf/' + filename, function (err, res) {
                if (err) return console.log(err);
                callback('done');
            });
        }, 1000);
    })
}

module.exports = router;