const mongoose = require('mongoose');
const {HTTPError} = require('./errorHandler');

const User = mongoose.model('User'); //These mongoose models are saved in the require cache
const Interest = mongoose.model('Interest');


function sendJson(res, contents, status) {
	res.status(status || 200);
	res.json(contents);
}

function getUserId(id, next) {
    try {
         return mongoose.Types.ObjectId(id);
    } catch(e) {
        return null;     
    }
}

exports.getOneUser = (req, res, next) => {
	if(!(req.params && req.params.userId)) {
		return next( HTTPError(404, "No user id in request") );
	}

	User.findById(req.params.userId)
		.then( (user) => {
			if(!user)
				return next( HTTPError(404, "User not found") );	

			let sendValue = {
                name: user.name,
                bio: user.bio || "",
                createdOn: user.createdOn,
                interests: user.interests || []
            };
            
			sendJson(res, sendValue);
        
		}, (err) => {
			next( HTTPError(404, "User not found") );
		});

};

exports.createUser =  (req, res, next) => {
	if(!(req.body && req.body.name)) {
		return next( HTTPError(400, "no name parameter") );
	}

	let {name, bio} = req.body;
	let newUser = new User({
		name,
		bio: bio || ""
	});
	
	newUser.save()
		.then( (success) => {
			sendJson(res, {"message": "User created."}, 201);
		}, (err) => {
			next( HTTPError(409, "Could not create user.") );
		});

};

exports.updateUser = (req, res, next) => {
    if(!(req.params && req.params.userId)) {
        return next( HTTPError(404, "No user id in request") );
    }
    
    let userId = getUserId(req.params.userId);
    if(!userId) 
        return next( HTTPError(404, "User not found.") ); 
    
    let {name, bio} = req.body;
    
    User.findById(userId).select("-interests").exec()
        .then( (user) => {
            if(!user) 
                throw HTTPError(404, "User not found.");
        
            user.name = name || user.name;
            user.bio = bio || user.bio;
            
            return new Promise( (resolve, reject) => {
                user.save()
                    .then( value => resolve(value), (err) => {
                        reject(HTTPError(400, "Could not update user."));
                    });
            });
     

        })
        .then( () => {
            sendJson(res, {message: "User updated."});
        }, (err) => {
            next(err);
        });
};

/*TODO======DEAL WITH THIS LATER=======*/
exports.addInterest = (req, res, next) => {
    if(!(req.params && req.params.userId)) {
        return next( HTTPError(404, "No user id in request.") );
    }
    
    if(!(req.body && req.body.interest)) {
        return next( HTTPError(404, "No interest name in the request.") );
    }
    
    let userId = getUserId(req.params.userId);
    if(!userId) 
        return next( HTTPError(404, "User not found.") ); 
    
    
    User.findById(userId).exec()
        .then( (user) => {
            if(!user) 
                throw HTTPError(404, "User not found.");
        
            return new Promise( (resolve, reject) => {
                Interest.find({title: req.body.interest}).exec()
                    .then( interest => resolve({user, interest:interest[0]}), (err) => {
                        reject(HTTPError(404, "Interest not found"))
                    });
            });
                    
        }, (err) => {
            return Promise.reject(HTTPError(404, "User not found"));
        })
        .then( ({user, interest}) => {
            if(!interest) 
                throw HTTPError(404, "Interest not found.") 
            
            user.interests.push(interest._id);
            user.save()
                .then( () => {
                    sendJson(res, {"message: ": "User interest updated." });
                }, (err) => {
                    throw HTTPError(400, "Could not update user interest.");
                });
        })
        .catch( err => next(err) );

};
/*====================================*/

exports.deleteUser = (req, res, next) => {
    if(!(req.params && req.params.userId)) {
        return next( HTTPError(404, "No user id in request") );
    }
    
    let userId = getUserId(req.params.userId);
    if(!userId) 
        return next( HTTPError(404, "User not found.") ); 
    
    User.findByIdAndRemove(userId).exec()
        .then ( () => {
            sendJson(res, {message: "User removed."}, 204);
        }, (err) => {
            next( HTTPError(404, "Could not remove user.") );
        });
};
