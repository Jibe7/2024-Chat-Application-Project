var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const register = require('../high-level-modules/add-user')

const PORT = process.env.PORT || 3000;
const app = express();
const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, // Set to true for https environments
      maxAge: 60000 * 60,
    } 
};

app.use(cookieParser('secret'));
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())

app.post('/login', (request, response) => {
    console.log(request.cookies)
    console.log(request.signedCookies)
    // console.log(request.session)
    console.log(request.sessionID)
    console.log(request.body)
    console.log(request.body.password)
    console.log(request.body.username)
    console.log("Hello")
    response.sendStatus(200)
    // response.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/register', (request, response) => {
    // console.log(request.cookies)
    // console.log(request.signedCookies)
    // console.log(request.session)
    console.log(request.body)
    console.log(request.body.username)
    console.log(request.body.password)
    console.log(request.sessionID)
    console.log("Hello")
    let result = register.AddUserToDatabase(request.body.username, request.body.password);
    // let result;
    if (!result) {
        console.log("Fail user registration")
        response.sendStatus(406);
    } else {
        response.sendStatus(201);
    }


    // response.sendFile(path.join(__dirname, '../public', 'index.html'));

});







app.listen(PORT, () => console.log(`Running on port ${PORT}`));

module.exports = app;