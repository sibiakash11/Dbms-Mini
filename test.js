var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const Handlebars = require('hbs')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sibi',
    database: 'food_del'
});
connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Hello connected!!');
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());


//app.get('/', function(request, response) {
//   response.sendFile(path.join(__dirname + '/login.html'));
//});

//app.use(express.static(path.join(__dirname, 'NodeJs')))

//app.use(express.urlencoded());
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('', (request, response) => {
    response.render('login.html')
})


app.post('/auth', function(request, response) {
    var mobileno = request.body.mobileno
    var password = request.body.password;
    if (mobileno && password) {
        connection.query('SELECT * FROM accounts WHERE mobileno = ? AND password = ?', [mobileno, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.mobileno = mobileno;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.use((request, response, next) => {
    console.log(request.headers)
    next()
})

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        // response.send('Welcome back, ' + request.session.mobileno + '!');
        response.render('index.hbs', { Name: 'Sibi' })
            // response.render('food.html')
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000, () => {
    console.log('Server is turned on 3000')
})