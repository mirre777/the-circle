//requirespiced-pg
const spicedPg = require('spiced-pg');
//require secrets.json with paasword and user
const {dbUser, dbPass} = require('./secrets.json');
//spiced pg database with passord and user
var db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/social`);
var bcrypt = require('bcryptjs');


function hashPassword (plainTextPassword) {
    console.log('in dbqueries.js, in hashPassword');
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                console.log('   bcrypt.genSalt failed', err)
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hashedPassword) {
                if (err) {
                    console.log('   bcrypt.hash failed', err)
                    return reject(err);
                }
                console.log('   hashPassword resolved')
                resolve(hashedPassword);
            });
        });
    });
}

function getHashedpw (email) {
    const q = `SELECT hashedpassword FROM users WHERE email = $1`;
    const params = [email]
    return db.query(q, params)
        .then(function(results) {
            return results.rows[0];
        })
        .catch(function(err) {
            console.log(err)
        });
}


function checkPassword (plainTextPassword, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(plainTextPassword, hashedPasswordFromDatabase, function(doesNotMatch, doesMatch) {
            if (doesNotMatch) {
                reject(doesNotMatch);
            }
            else {
                resolve(doesMatch);
            }
        });
    });
}


function getUserId(email) {
    const q = `SELECT
    id
    FROM users
    WHERE email = $1`
    const params = [email];
    return db.query(q, params)
        .then(function(results) {
            return results.rows[0];
        })
}


function insertRegisterData (first, last, email, favoritecolor, hashedPassword) {
    console.log('in dbqueries.js, in inserRegisterData');
    const q = `INSERT INTO users (first, last, email, favoritecolor, hashedpassword) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [first, last, email, favoritecolor, hashedPassword];
    return db.query(q, params)
        .then(function(results) {
            console.log('   db query made, this is results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            console.log('error in dbqueries, insertRegisterData, in .catch', err);
        })
}

exports.hashPassword = hashPassword;
exports.insertRegisterData = insertRegisterData;
exports.checkPassword = checkPassword;
exports.getHashedpw = getHashedpw;
exports.getUserId = getUserId;
