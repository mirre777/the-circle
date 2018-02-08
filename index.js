const express = require('express');
const app = express();
const compression = require('compression');
const hashPassword = require('./dbqueries.js').hashPassword
const insertRegisterData = require('./dbqueries.js').insertRegisterData
const getUserId = require('./dbqueries.js').getUserId
const checkPassword = require('./dbqueries.js').checkPassword
const getHashedpw = require('./dbqueries.js').getHashedpw
const storePicture = require('./dbqueries.js').storePicture
const getUserInfo = require('./dbqueries.js').getUserInfo
const getOtherUserInfo = require('./dbqueries.js').getOtherUserInfo
const storeBio = require('./dbqueries.js').storeBio
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require ('body-parser');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const uploadToS3 = require('./s3middleware').uploadToS3;
const s3Url = require('./s3middleware').s3Url;

//MULTER
var diskStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});


//multer: combines all information about the file, and call next
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 3097152
    }
});


app.use(compression());
app.use(express.static('./public'));
app.use(cookieParser());
app.use(cookieSession ({
    secret: require('./secrets.json').sessSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(bodyParser.urlencoded ({
    extended: false
}));
app.use(bodyParser.json());


if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
}
else {
    app.use('/bundle.js', (request, response) => response.sendFile(`${__dirname}/bundle.js`));
}


///////check logged in on registration page
app.get('/welcome', function(request, response) {
    if (request.session.userid) {
        response.redirect('/')
    }
    else {
        response.sendFile(__dirname + '/index.html');
    }
});


app.post('/register', function(request, response) {
    var bio = 'write your bio';
    console.log('in app.post /register');
    console.log('this is request.body.password: ', request.body.password);
    hashPassword(request.body.password)
        .then(function(hashedPassword) {
            console.log('   in app.post /register, in hashPassword, in .then');
            const {first, last, email, favoritecolor} = request.body;
            insertRegisterData(first, last, email, favoritecolor, hashedPassword, bio)
                .then(id => {
                    console.log('   in app.post / register, in insertRegister, in .then');
                    request.session.userid = id;
                    console.log('request.session.userid: ', request.session.userid)
                    return response.json ({
                        success: true
                    })
                })
                .catch(err => {
                    console.log('   in app.post /register, in inserRegisterData, in .catch', err);
                })
        })
        .catch(err => {
            console.log('error in app.post /register, hashPassword', err)
        })
})


app.post('/login', function(request, response) {
    console.log('in app.post /login');
    getHashedpw(request.body.email)
        .then(function(hashedPasswordFromDatabase) {
            console.log('   this is hashedPasswordFromDatabase', hashedPasswordFromDatabase.hashedpassword);
            checkPassword(request.body.password, hashedPasswordFromDatabase.hashedpassword)
                .then(function(doesMatch){
                    if(doesMatch) {
                        getUserId(request.body.email)
                            .then(function(id) {
                                request.session.userid = id;
                                console.log('request.session: ', request.session.userid);
                                return response.json ({
                                    success: true
                                })
                            })
                            .catch(err => {
                                console.log('   in app.post /login, error in getUserId, in .catch', err)
                            });
                    }
                })
                .catch(err => {
                    console.log('   in app.post /login, error in checkPassword, in .catch', err)
                });
        })
        .catch(err => {
            console.log('   in app.post /login, error in getHashedpw, in .catch', err)
        });
});

app.post('/logout', function (request, response) {
    request.session.userid = null;
});


app.get('/user', function(request, response) {
    console.log('in app.get /user')
    console.log('request.session.userid: ', request.session.userid);
    getUserInfo(request.session.userid)
        .then(results => {
            console.log('results in app.get /user, getUserInfo: ', results)
            //send results to axios.get (/user in app.js)
            results.picture = s3Url + results.picture;
            return response.json ({
                id: results.id,
                first: results.first,
                last: results.last,
                picture: results.picture,
                favoritecolor: results.favoritecolor,
                bio: results.bio
            })
        })
        .catch(err => {
            console.log('in app.get /user, in .catch, error: ', err);
        });
});


app.get('/get-user/:id', function(request, response) {
    console.log('in app.get /get-user');
    getOtherUserInfo(request.params.id)
        .then(results => {
            console.log('in app.get /get-user, getOtherUserInfo, in .then');
            console.log('in app.get /get-user, getOtherUserInfo, in .then, results: ', results);
            results.picture = results.picture && (s3Url + results.picture);
            response.json ({
                first: results.first,
                last: results.last,
                picture: results.picture,
                favoritecolor: results.favoritecolor,
                bio: results.bio
            })
        })
        .catch(err => {
            console.log('in app.get /get-user, getOtherUserInfo, in .catch');
        });
})


app.post('/upload', uploader.single('file'), uploadToS3, function(request, response) {
    console.log('in app.post /upload');
    storePicture(request.file.filename, request.session.userid)
        .then(results => {
            console.log('in app.post /upload, in storePicture, stored picture succesfully');
            results.picture = s3Url + results.picture;
            return response.json ({
                picture: results.picture,
                success: true
            })
    })
    .catch(err => {
        console.log('app.post /upload, storePicture, in .catch', err);
    })
});

app.post ('/upload-bio', function(request, response) {
    console.log('in app.post /upload-bio');
    console.log('in app.post /upload-bio, request.body.bio: ', request.body.bio);
    //userid is undefined
    console.log('in app.post /upload-bio, request.session.userid: ', request.body.userid);
    storeBio(request.body.bio, request.session.userid)
        .then(results => {
            console.log('in app.post /upload-bio, in storeBio, in .then, results from DB: ', results);
            return response.json ({
                bio: results.bio,
                success: true
            })
        })
        .catch(err=> {
            console.log('in app.post /upload-bio, in storeBio, in .catch, error: ', err);
        })
})
/////check logged in for any other url than /welcome
//last one
app.get('*', function(request, response) {
    if (!request.session.userid) {
        response.redirect('/welcome')
    }
    else {
        response.sendFile(__dirname + '/index.html');
    }
});


app.listen(8080, function() {
    console.log("I'm listening.");
});
