var createError = require('http-errors');
const express = require('express');
const nofavicon = require('express-no-favicons');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();
require('./db');

const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io').listen(server);

app.use(nofavicon());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next){
    if (req.is('text/*')) {
        req.text = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){ req.text += chunk });
        req.on('end', next);
    } else {
        next();
    }
  });

app.use('/api', require('./routes'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, function(){
    console.log('App listening on port 3000');
});

const users = {}; // все пользователи чата
const sockets = {}; // все действующие сокеты

io.on('connection', socket => {

    users[socket.id] = {
        username: socket.handshake.headers['username'],
        id: socket.id
    }

    sockets[socket.id] = socket;

    socket.json.emit('all users', users);
    socket.broadcast.json.emit('new user', users[socket.id]);

    socket.on('chat message', function (message, recipientId) {
        sockets[recipientId].json.emit('chat message', message, socket.id);
    })

    socket.on('disconnect', function (data) {
        socket.broadcast.json.emit('delete user', socket.id);
        delete users[socket.id];
        delete sockets[socket.id];
    });
    
  });