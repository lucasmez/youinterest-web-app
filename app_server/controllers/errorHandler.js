const {STATUS_CODES}= require('http');

module.exports = (err, req, res, next) => {
    if (err.statusCode >= 100 && err.statusCode < 600)
        res.status(err.statusCode);
    else
        res.status(500);
    
    let loggedIn = false;
        
    
    res.render("error", {
        pageTitle: `Error ${err.statusCode}`,
        message: `${err.message}. ${STATUS_CODES[err.statusCode]}`,
        account: loggedIn ? "Lucas" : null
    });
}