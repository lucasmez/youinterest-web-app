const 	express = require('express'),
	bodyParser = require('body-parser'),
	db = require('./app_api/db');	// Establish mongoDB connection and cache models
	config = require('./config'),
	apiRoutes = require('./app_api/routes');

const app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api", apiRoutes);


app.listen(config.PORT, () => {
	console.log("Server listening on port ", config.PORT);
});
