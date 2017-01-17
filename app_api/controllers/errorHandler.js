const util = require('util');

function HTTPErrorConstructor(code, message) {
	this.statusCode = code;
	this.message = message;
}

util.inherits(HTTPErrorConstructor, Error);

module.exports.HTTPError = (code, message) => {
	return new HTTPErrorConstructor(code, message);
}

module.exports.errorHandler = (err, req, res, next) => {
    if (err.statusCode >= 100 && err.statusCode < 600)
        res.status(err.statusCode);
    else
        res.status(500);
    
	res.status(err.statusCode);
	res.json({"message": err.message});
}

