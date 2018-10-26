var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllCompany = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, Status, CompanyCode, CompanyName FROM Company;', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllCompanyByCriteria = function (Company, done) {
    var wh = db.whereCriteriaGenerator(Company);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, Status, CompanyCode, CompanyName FROM Company"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertCompany = function (Company, done) {
    var values = [Company.CompanyCode, Company.CompanyName]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_CompanyIn(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateCompany = function (key,Company, done) {
    var values = [Company.Status, Company.CompanyName, key]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Company SET Status=?,CompanyName=? WHERE CompanyCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteCompany = function (key1, key2, done) {
    var values = [key1, key2]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Company WHERE Username=? AND QCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}