let config = {};
module.exports = config;

// Production
if(process.env.NODE_ENV === "production") {
	config.DB_URI = process.env.MONGOLAB_URI;  // Database URI
	config.PORT = process.env.PORT;            // Server listening port   
	console.log("Production mode.");
}

//Development
else {
	let developConfig;
	try {
		developConfig = require('./developmentConfig');
	} catch(e) {
		console.error("Error reading Development configuration file.", e.message);
		process.exit(1);
	}

	module.exports = config = developConfig;
	console.log("Development mode.");
}

