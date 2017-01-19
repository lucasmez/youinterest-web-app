// Get account info. from server if user is logged in

const {recommended_limit, popular_limit} = require('../config');

module.exports.getAccount = function(cb) {
    $.ajax('/account').then( response => {
        cb(response);
    }, err => {
        cb({message: "Error getting request from server."});
    });
};

module.exports.searchInterests = function(term ,cb) {
    return $.ajax(`/api/interests?title=${term}`);
};

module.exports.getInterestsRecommendations = function(account) {
    return new Promise( (resolve, reject) => {
        if(account) {
            $.ajax(`/api/users/${account._id}/recommendations?limit=${recommended_limit}`)
                .then( resolve, () => reject([]));
        }
        
        else {
            $.ajax(`/api/interests/popular?limit=${popular_limit}`).then( resolve, () => reject([]));
        }
    
    });
}