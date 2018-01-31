const express = require('express');
const app = express();
const compression = require('compression');
const hashPassword = require('./dbqueries.js').hashPassword
const insertRegisterData = require('./dbqueries.js').insertRegisterData
const getUserId = require('./dbqueries.js').getUserId
const checkPassword = require('./dbqueries.js').checkPassword
const getHashedpw = require('./dbqueries.js').getHashedpw
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require ('body-parser');

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
    if (request.session.id) {
        response.redirect('/')
    }
    else {
        response.sendFile(__dirname + '/index.html');
    }
});


app.post('/register', function(request, response) {
    console.log('in app.post /register');
    console.log('this is request.body.password: ', request.body.password);
    hashPassword(request.body.password)
        .then(function(hashedPassword) {
            console.log('   in app.post /register, in hashPassword, in .then');
            //undefined
            const {first, last, email, favoritecolor} = request.body;
            insertRegisterData(first, last, email, favoritecolor, hashedPassword)
                .then(id => {
                    console.log('   in app.post / register, in insertRegister, in .then');
                    //set request.session
                    request.session.id = id;
                    // request.session.id
                    // request.session.first
                    // request.session.last,
                    // request.session.email,
                    // request.session.favoritecolor
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
                                request.session.id = id;
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


/////check logged in for any other url than /welcome
//last one
app.get('*', function(request, response) {
    if (!request.session.id) {
        response.redirect('/welcome')
    }
    else {
        response.sendFile(__dirname + '/index.html');
    }
});


app.listen(8080, function() {
    console.log("I'm listening.");
});
