var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllUser = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, Status, Username, Password, LastLogin, CompanyCode, IsAdmin FROM Users;', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllUserByCriteria = function (User, done) {
    var wh = db.whereCriteriaGenerator(User);
    db.get(db.trx, function (err, connection) {
        if (err) {
            console.log(err);
            return done('Database problem')
        }
        connection.query("SELECT Id, Status, Username, Password, LastLogin, CompanyCode, IsAdmin FROM Users"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertUser = function (User, done) {
    var values = [User.Username, User.CompanyCode]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_UserIn(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateUser = function (key, User, done) {
    var values = [User.CompanyCode, key]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Users SET CompanyCode=?, WHERE Username=? ', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteUser = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM User WHERE Username=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}