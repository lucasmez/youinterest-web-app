const mongoose = require('mongoose');
const config = require('../../config');

mongoose.Promise = require('bluebird');
mongoose.connect(config.DB_URI);

let connection = module.exports = mongoose.connection;

// Mongoose Events
connection.on('error', (err) => {
	console.error("Could not connect to the database: ", err.message);
	process.exit(1);
});

connection.once('connected', console.log.bind(console , "Connected to database at: ", config.DB_URI) );
connection.on('reconnected', console.log.bind(console , "Reconnected to database at: ", config.DB_URI) );


// Attach event handlers to OS signals
process.on('SIGINT', () => { //	Keyboard interrupt
	shutItAllDown("App terminated.", () => process.exit(0) );
});

process.on('SIGTERM', () => { // Heroku termination
	shutItAllDown("Heroku app shutdown.", () => process.exit(0) );
});


function shutItAllDown(message, fn) {
	console.log(message);
	connection.close(fn);
}

// Require models to initialize them to the mongoose variable (which will be cached for requires).
require('../models/users');
require('../models/interest');
