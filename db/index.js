const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.Promise = global.Promise;

const dbuser = process.env.DB_USER || config.db.user;
const dbpass = process.env.DB_PASS || config.db.password;
const dbhost = process.env.DB_HOST || config.db.host;
const dbport = process.env.DB_PORT || config.db.port;
const dbname = process.env.DB_NAME || config.db.name;

// const connectionURL = `mongodb://${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name}`;
const connectionURL = `mongodb://${dbuser}:${dbpass}@${dbhost}:${dbport}/${dbname}`;

mongoose.connect(connectionURL, { useNewUrlParser: true })
        .catch( e => console.error(e) );

const db = mongoose.connection;

db.on('connect', () => {
    console.log(`Mongoose connection open on ${connectionURL}`);
});

db.on('error', (err) => console.error(err));

db.on('disconnected', () => {
    console.log('Mongoose connection disconected');
});

process.on('SIGTERM', () => {
    db.close(() => {
        console.log('Mongoose connection closed throw app termination');
        process.exit();
    })
});