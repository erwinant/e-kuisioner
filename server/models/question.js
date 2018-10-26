var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllQuestion = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, Status, QCode, ParentQCode, OrderDesc, QText, CompanyCode FROM Question;', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllQuestionByCriteria = function (Question, done) {
    var wh = db.whereCriteriaGenerator(Question);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, Status, QCode, ParentQCode, OrderDesc, QText, CompanyCode FROM Question"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertQuestion = function (Question, done) {
    var values = [Question.ParentQCode, Question.OrderDesc, Question.QText, Question.CompanyCode]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_QuestionIn(?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateQuestion = function (key,Question, done) {
    var values = [Question.QText, Question.OrderDesc, Question.ParentQCode, Question.Status, key]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Question SET QText=?,OrderDesc=?,ParentQCode=?,Status=? WHERE QCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteQuestion = function (key1, key2, done) {
    var values = [key1, key2]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Question WHERE QCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}