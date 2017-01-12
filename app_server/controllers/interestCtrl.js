const axios = require('axios');

const {SERVER_URL, PORT} = require('../../config');


module.exports = (req, res, next) => {
    if(!(req.params && req.params.interestTitle)) {
        return next({statusCode: 404, message: "Page does not exist"});
    }
    
    let request_url = `${SERVER_URL}:${PORT}/api/interest?title=${req.params.interestTitle}`;
    
    axios.get(request_url)
        .then( (interest) => {
            if(!interest) {
                return Promise.reject({statusCode: 404, message: "This interest does not exist."});
            }
          
            let sess = req.session;
        
            interest = interest.data;
            interest.pageTitle = interest.title;
            interest.users = [];
            interest.account = sess.account || null;
        
            if(interest.usersInterested.length > 0)
                return interest;
        
            else {
                res.render("interest", interest);
                return {done:true};
            }
        
        }, (err) => {
            return Promise.reject({statusCode: 404, message: "This interest does not exist."});
        })
    
        .then( interest => {
            if(interest.done) 
                return true;
        
            request_url = `${SERVER_URL}:${PORT}/api/users?interest=${interest.title}`;
        
            return axios.get(request_url)
                .then( (users) => {
                    interest.users = users.data;
                    res.render("interest", interest);
                
                }, (err) => {
                    return Promise.reject({statusCode: 404, message: "Error making request to database API."});
                });
        
        })
        .catch( err => next(err));
};