module.exports = (req, res, next) => {
    let sess = req.session;
    
    res.json(sess.account || {
       message: "Not logged in." 
    });

};