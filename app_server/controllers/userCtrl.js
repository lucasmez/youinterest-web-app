const _ = require('underscore');
const {SERVER_URL, PORT} = require('../../config');
const axios = require('axios');

module.exports = (req, res, next) => {
    if(!(req.params && req.params.userName)) {
        return next({statusCode: 404, message: "Page does not exist"});
    }

    let name = req.params.userName;
    let request_url = `${SERVER_URL}:${PORT}/api/users?name=${encodeURIComponent(name)}`;
 
    axios.get(request_url)
        .then( ({data}) => {
            if(!(data || data[0].name)) // Not a user
                return next({statusCode: 404, message: "User does not exist."});
        
            data = data[0];
  
           
            renderObj = {
                name: data.name,
                bio: data.bio || "",
                pageTitle: data.name,
                interests: data.interests || null,
                account: null,
                isMyAccount: false
            };

            let sess = req.session;
            let loggedIn = !!sess.account;
        
            if(loggedIn) {
                renderObj.isMyAccount = (sess.account.name === data.name);
                renderObj.account = sess.account;
                renderObj.common = _.intersection(sess.account.interests, data.interests),  // Common interests
                renderObj.different = _.without(data.interests, sess.account.interests) // Different interests
            }

            res.render("user", renderObj);

        }, (err) => {
            if(err.response.data.message === "User not found")
                next({statusCode: 404, message: "User not found"});
            else
                next({statusCode: 404, message: "Error making request to database."});
        })
        .catch( err => console.log(err));

};
