var us = require('../models/user');
var an = require('../models/answer');
var qs = require('../models/question');
var cp = require('../models/company');

var express = require('express');
var router = express.Router();

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
    an.updateAnswer(req.params.key1,req.params.key2, req.body, function (err, rows) {
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

module.exports = router;