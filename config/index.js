// Production
if(process.env.NODE_ENV === "production") {
    let config = {};
 
	config.DB_URI = process.env.MONGOLAB_URI;                           // Database URI
	config.PORT = process.env.PORT;                                     // Server listening port  
    config.SESSION = {SECRET: process.env.SESSION_SECRET || "mySecret"};
    config.SERVER_URL = process.env.SERVER_URL;
    config.DB_SALT_FACTOR = process.env.DB_SALT_FACTOR || 10;
    
    module.exports = config;
	console.log("Production mode.");
}

//Development
else {
	let developConfig;
    
	try {
		developConfig = require('../../Interest App Config/developmentConfig');
	} catch(e) {
		console.error("Error reading Development configuration file.", e.message);
		process.exit(1);
	}

	module.exports = developConfig;
	console.log("Development mode.");
}

