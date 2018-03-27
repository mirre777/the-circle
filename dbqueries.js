//requirespiced-pg
const spicedPg = require('spiced-pg');
//require secrets.json with paasword and user
const {dbUser, dbPass} = require('./secret.json');
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
    console.log('about to run getHashedpw', email);
    return db.query(q, params)
        .then(function(results) {
            console.log('results.rows[0] in getHashedpw: ', results.rows);
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
            return results.rows[0].id;
        })
}


function insertRegisterData (first, last, email, favoritecolor, hashedPassword, bio) {
    console.log('in dbqueries.js, in inserRegisterData');
    const q = `INSERT INTO users (first, last, email, favoritecolor, hashedpassword, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const params = [first, last, email, favoritecolor, hashedPassword, bio];
    return db.query(q, params)
        .then(function(results) {
            console.log('   db query made, this is results.rows[0].id: ', results.rows[0].id);
            return results.rows[0].id;
        })
        .catch(err => {
            console.log('error in dbqueries, insertRegisterData, in .catch', err);
        })
}

function getUserInfo(id) {
    console.log('in dbqueries, getUserInfo')
    const q = `SELECT *
    FROM users
    WHERE id = $1`
    const params = [id];
    return db.query(q, params)
        .then(function(results) {
            console.log('in dbqueries, getUserInfo, results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            console.log('   in .catch, error: ', err)
        })
}


function getOtherUserInfo(id) {
    console.log('in dbqueries, getOtherUserInfo')
    const q = `SELECT *
    FROM users
    WHERE id = $1`
    const params = [id];
    return db.query(q, params)
        .then(function(results) {
            console.log('   in dbqueries, getOtherUserInfo, results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            console.log('   in dbqueries, getOtherUserInfo,in .catch, error: ', err)
        })
}


function getFriendStatus(paramsid, userid) {
    console.log('dbqueries, getFriendStatus');
     const q = `SELECT * FROM friends WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
     const params = [paramsid, userid];
     return db.query(q, params)
        .then(results => {
            console.log('dbqueries, getFriendStatus, in .then, results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            console.log('dbqueries, getFriendStatus, in .catch, error: ', err);
        });
}


function makeFriend(userid, paramsid, status) {
    console.log('dbqueries, makeFriend');
    const q = `INSERT INTO friends (sender_id, recipient_id, status) VALUES ($1, $2, $3)`;
    const params = [userid, paramsid, status];
    return db.query(q, params)
        .then(results => {
            console.log('dbqueries, makeFriend, results.rows[0]', results.rows[0]);
        })
        .catch(err => {
            console.log('dbqueries, makeFriend, in .catch', err);
        });
}


function deleteFriend(paramsid, userid) {
    console.log('dbqueries, deleteFriend');
    const q = `DELETE FROM friends WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [paramsid, userid];
    return db.query(q, params)
        .then(results => {
            console.log('dbqueries, deleteFriend, in .then');
        })
        .catch(err => {
            console.log('dbqueries, deleteFriend, in .catch', err);
        });
}


function getFriendList(id) {
    const PENDING = 1, ACCEPTED = 2;
    console.log('dbqueries, getFriendList');
    const q = `SELECT users.id, users.first, users.last, users.picture, status
                FROM users
                JOIN friends
                ON (status = ${PENDING} AND recipient_id = $1 AND sender_id = users.id)
                OR (status = ${ACCEPTED} AND recipient_id = $1 AND sender_id = users.id)
                OR (status = ${ACCEPTED} AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params)
        .then(results => {
            console.log('dbqueries, getFriendList, then, results.rows: ', results.rows);
            return results.rows
        })
}

function storePicture(picture, id) {
    console.log('in dbqueries, storePicture');
    const q = `
    UPDATE users
    SET picture = $1
    WHERE id = $2
    RETURNING *`
    const params = [picture, id];
    return db.query(q, params)
        .then(results => {
            console.log('   in dbqueries, in storePicture, in .then');
            console.log('results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            console.log('   in dbqueries, in storePicture, in .catch');
        });
}


function storeBio(bio, id) {
    console.log('in dbqueries, in storeBio');
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio`
    const params = [bio, id];
    return db.query(q,params)
        .then(results => {
            console.log('   in dbqueries, in storeBio, in .then');
            console.log('results.rows[0]: ', results.rows[0]);
            return results.rows[0];
        })
        .catch(err=> {
            console.log('in dbqueries, in storeBio, in .catch');
        });

}

exports.hashPassword = hashPassword;
exports.insertRegisterData = insertRegisterData;
exports.checkPassword = checkPassword;
exports.getHashedpw = getHashedpw;
exports.getUserId = getUserId;
exports.getUserInfo = getUserInfo;
exports.getOtherUserInfo = getOtherUserInfo;
exports.storePicture = storePicture;
exports.storeBio = storeBio;
exports.getFriendStatus = getFriendStatus;
exports.makeFriend = makeFriend;
exports.deleteFriend = deleteFriend;
exports.getFriendList = getFriendList;
