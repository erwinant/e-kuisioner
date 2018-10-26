var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllAnswer = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, Status, QCode, Answer, Username FROM Answer;', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllAnswerByCriteria = function (Answer, done) {
    var wh = db.whereCriteriaGenerator(Answer);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, Status, QCode, Answer, Username FROM Answer"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertAnswer = function (Answer, done) {
    var values = [Answer.QCode, Answer.Answer, Answer.Username]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_AnswerIn(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateAnswer = function (key1, key2, Answer, done) {
    var values = [Answer.Answer,Answer.Status, key1, key2]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Answer SET Answer=?, Status=? WHERE Username=? AND QCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteAnswer = function (key1, key2, done) {
    var values = [key1, key2]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Answer WHERE Username=? AND QCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}