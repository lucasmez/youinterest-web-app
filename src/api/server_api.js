// Get account info. from server if user is logged in


module.exports.getAccount = function(cb) {
    $.ajax('/account').then( response => {
        cb(response);
    }, err => {
        cb({message: "Error getting request from server."});
    });
}
