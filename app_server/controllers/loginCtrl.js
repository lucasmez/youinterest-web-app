const qs = require('querystring');
const axios = require('axios');
const {SERVER_URL, PORT} = require('../../config');

function authenticateUser(req, name, password, cb) {
    let sess = req.session;
    
    let request_url = `${SERVER_URL}:${PORT}/api/authenticate`;
    
    axios({
        method: 'post',
        url: request_url,
        headers: {
          'Content-Type':  'application/x-www-form-urlencoded' 
        },
        data: qs.stringify({
            username: name,
            password: password
        })
    }).then( response => {
            if(response.data.authentication === "success") {
                // Ger user information
                let request_url = `${SERVER_URL}:${PORT}/api/users?name=${encodeURIComponent(name)}`;
           
                return axios.get(request_url)
                    .then( ({data}) => {
                        if(!data[0].name)
                            throw {authentication: "Error getting user information."};
                    
                        data = data[0];
                    
                        sess.account = {
                            name: data.name,
                            interests: data.interests
                        };
                    
                        cb();
                    })
                
            }
        
            else
                cb(response.data.authentication);
        
        }, err => {
            cb(err.response.data.authentication);
        })
        .catch( err => {
            cb(err);
        })
    

}

module.exports.doLogin = (req, res, next) => {
    let {username, password} = req.body;

    if(!(username && password)) {
        req.flash('login', 'Username or password not present. Try again.');
        return res.redirect('/login');
    }
    
    authenticateUser(req, username, password, (err) => {
        if(err) {
            req.flash('login', err);
            return res.redirect('/login');
        }
        
        res.redirect(`/user/${username}`);
    });
            
};

module.exports.loginRender = (req, res, next) => {
    if(req.session.account)
        res.redirect(`/user/${req.session.account.name}`);
    
    else
        res.render("login", {pageTitle: "Login"});
}

module.exports.doLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}