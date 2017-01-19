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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


exports.getUsers = (req, res, next) => {
    if(Object.keys(req.query).length === 0) // no query
        return next( HTTPError(404, "No query parameters.") );
    
    let {name, createdOn, friends, interests, fields, limit, mode, format} = req.query;
    
    buildQuery().exec()
    .then( usersAr => {
        if(usersAr.length === 0)
            return next( HTTPError(404, "No users found.") ); 
        
        if(!format || format === "id")
            return sendJson(res, usersAr);
        
        else if(format !== "value")
            return next( HTTPError(404, "format parameter should be either 'id' or 'value'.") ); 
        
        replaceAllIdsForValues(usersAr).then( users => {
            sendJson(res, users);
            
        }, err => {
            next( err );
        });
        
        
    }, err => {
        next( HTTPError(500, "Error making users query.") );
    });
    
    function buildQuery() {
        let query = {},
            modee = (mode && (mode === "or")) ? "or" : "and"; //query format default to 'and'
         
            
        if(name)
            query.name = new RegExp("^"+escapeRegExp(name), "i");
        
//        if(createdOn)
//            query.createdOn = createdOn; //Change to right format
        
        if(friends) {
            if(modee === "and") 
                query.friends = {$all: friends.split(",")}
            
            else 
                friends.tags = {$in: friends.split(",")}; 
        }
        
        if(interests) {    
            if(modee === "and") 
                query.interests = {$all: interests.split(",")}
            
            else 
                query.interests = {$in: interests.split(",")}; 
        }

        query = User.find(query);
        
        if(fields)
            query = query.select(fields.replace(/,/g, " "));
        
        if(limit)
            query = query.limit(parseInt(limit));
        
        return query;
    }
    
    function replaceAllIdsForValues(usersAr) {
        //TODO Make this parellel instead of sequential
        return replaceInterestsIdsForTitles(usersAr)
                .then( users => {
                    return replaceFriendsIdsForNames(users)
                })
                .then( users => {
                    return replaceMatchesIdsForNames(users)
                });
      
    }
    
    function replaceInterestsIdsForTitles(usersAr) {
        return Promise.all(usersAr.map( user => {
            if(!user.interests || user.interests.length === 0)
                return Promise.resolve(user);
            
            return Interest.find({_id: {$in: user.interests}}).select("title")
                    .then( interests => {
                        let retUser = {
                            _id: user._id,
                            name: user.name,
                            bio: user.bio,
                            createdOn: user.createdOn,
                            friends: user.friends,
                            matches: user.matches
                        };
                
                        retUser.interests = interests.map( interest => interest.title);

                        return retUser;
                
                    }, err => {
                        return HTTPError(500, "Error making interests titles queries.")
                    });
        }));
    }  
    
    function replaceFriendsIdsForNames(usersAr) {  
        return Promise.all(usersAr.map( user => {
            if(!user.friends || user.friends.length === 0)
                return Promise.resolve(user);
            
            return User.find({_id: {$in: user.friends}}).select("name")
                    .then( usersResults => {
                        let retUser = {
                            _id: user._id,
                            name: user.name,
                            bio: user.bio,
                            createdOn: user.createdOn,
                            interests: user.interests,
                            matches: user.matches
                        };
                
                        retUser.friends = usersResults.map( thisUser => thisUser.name);
        
                        return retUser;
                
                    }, err => {
                        return HTTPError(500, "Error making users names queries.")
                    });
        }));
    }
    
    function replaceMatchesIdsForNames(usersAr) {  
        return Promise.all(usersAr.map( user => {
            if(!user.matches || user.matches.length === 0)
                return Promise.resolve(user);
            
            return User.find({_id: {$in: user.matches}}).select("name")
                    .then( usersResults => {
                        let retUser = {
                            _id: user._id,
                            name: user.name,
                            bio: user.bio,
                            createdOn: user.createdOn,
                            interests: user.interests,
                            friends: user.friends
                        };
                
                
                        retUser.matches = usersResults.map( thisUser => thisUser.name);
  
                        return retUser;
                
                    }, err => {
                        return HTTPError(500, "Error making users names queries.")
                    });
        }));
    }

};

exports.getRecommendations = (req, res, next) => {
    const MAX_COMMON_TAGS = 5;  // # of tags to return as most common ones
    const MAX_COOMON_CATS = 2;  // # of categories to return as most common ones
    
    if(!(req.params && req.params.userId)) {
		return next( HTTPError(404, "No user id in request") );
	}
    
    User.findById(req.params.userId)
    
    .then( user => {
        if(user.interests.length === 0)
            throw HTTPError(404, "No interests to present.");
        
        return getCommonTagsAndCategories(user.interests)
                .then( results => {
                    let query = Interest.find({
                                    _id: {$nin: user.interests},
                                    tags: {$in: results.tags},
                                    category: {$in: results.categories}
                                });
            
                    if(req.params.limit)
                        return query.limit(req.params.limit);
                    else
                        return query;

                }, err => {
                    throw HTTPError(500, "Error getting interests.");
                });
        
    }, err => {
        throw HTTPError(404, "User does not exist.");
    })
    
    .then( recommendations => {
        if(recommendations.length === 0)
            return next( HTTPError(404, "No recommendations.") );
        
        sendJson(res, recommendations);
        
    }, err => {
        next(err);
    });
    
    
    function getCommonTagsAndCategories(interestsIds) {
        return new Promise( (resolve, reject) => {
            Interest.find({_id: {$in: interestsIds}})
            .then( interests => {
                if(interests.length === 0)
                    reject();
                
                //parse common tags and categories, resolve with {tags: ..., categoies: ...}
                let tagsBuffer = {},
                    catBuffer = {};
                
                interests.forEach( interest => {
                    interest.tags.forEach( tag => {
                        tagsBuffer[tag] = tagsBuffer[tag] ? tagsBuffer[tag] + 1 : 1;
                    });
                    
                    catBuffer[interest.category] = catBuffer[interest.category] ? catBuffer[interest.category] + 1 : 1;
                    
                });
                
                let tagsSorted = Object.keys(tagsBuffer).sort( (a, b) =>  tagsBuffer[b] - tagsBuffer[a]),
                    catsSorted = Object.keys(catBuffer).sort( (a, b) =>  catBuffer[b] - catBuffer[a]);
                
                resolve({
                    tags: tagsSorted.slice(0, MAX_COMMON_TAGS),
                    categories: catsSorted.slice(0, MAX_COOMON_CATS)
                });
                
            }, err => {
                reject(err);
            }); 
            
        });
    }
   
};

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
                interests: user.interests || [],
                friends: user.friends || [],
                matches: user.matches || []
            };
            
			sendJson(res, sendValue);
        
		}, (err) => {
			next( HTTPError(404, "User not found") );
		});

};

exports.createUser =  (req, res, next) => {
	if(!(req.body && req.body.name && req.body.password)) {
		return next( HTTPError(400, "no name or password parameter") );
	}

	let {name, bio, password} = req.body;
	let newUser = new User({
		name,
		bio: bio || "",
        password
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
    
    User.findById(userId).select("-interests -friends -matches").exec()
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
    
    
    Interest.findOne({title: req.body.interest})
        .then( interest => {    // interest was found
            return new Promise( (resolve, reject) => {
                User.findOneAndUpdate({_id: userId}, {$addToSet: {interests: interest._id}})
                    .then( () => resolve(interest), err => reject(err));
            });
        
        }, err => { // interest not found
            next(HTTPError(404, "Interest not found"));
        })
    
        .then( (interest) => {  // user was updated
            interest.update({$addToSet: {usersInterested: userId}})
            
                .then( () => { // Update successfull
                    sendJson(res, {message: "User updated."});
                
                }, err => { // Failed to update interest
                    User.findOneAndUpdate({_id: userId}, {$pull: {interests: interest._id}}) // Failed to undo first update in user
                        .catch( err => {
                            console.error(`Database error. Remove user.interests value ${interest._id} from user ${userId}`);
                        })
                });

        }, err => { // failed to update user
            return next(HTTPError(400, "Could not update user."));
        });

};


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

exports.deleteInterest = (req, res, next) => {
    if(!(req.params && req.params.userId)) {
        return next( HTTPError(404, "No user id in request.") );
    }
    
    if(!(req.body && req.body.interest)) {
        return next( HTTPError(404, "No interest name in the request.") );
    }
    
    let userId = getUserId(req.params.userId);
    if(!userId) 
        return next( HTTPError(404, "User not found.") ); 
    
    Interest.findOne({title: req.body.interest})
        .then( (interest) => { // interest found
            
            return new Promise( (resolve, reject) => {
                User.findOneAndUpdate({_id: userId}, {$pull: {interests: interest._id}})
                    .then ( () => resolve(interest), err => reject(err));
            });
        
        }, err => { // interest not found
            next( HTTPError(404, "Interest not found.") );
        })
    
        .then( interest => {  // interest removed from user
            
            interest.update({$pull: {usersInterested: userId}})
            
                .then( () => { // update successfull
                    sendJson(res, {message: "User updated."});
                
                }, err => { // could not remove user from interest.usersInterested
                    User.findOneAndUpdate({_id: userId}, {$push: {interests: interest._id}})
                    
                        .catch( err => { // failed to undo user removal
                            console.error(`Database error. Add user.interests value ${interest._id} to user ${userId}`);
                        });
                });
        
        }, err => { // could not remove interest from user
            next(HTTPError(500, "Could not update user."));
        });
}

exports.authenticate = (req, res, next) => {
    let {username, password} = req.body;
    
    if(!(username && password)) {
        return sendJson(res, {"authentication": "failed"}, 404);
    }
    
    User.find({name: username})
        .then( user => {
            user = user[0];
            if(!user)
                return sendJson(res, {"authentication": "User does not exist"}, 404);
        
            return new Promise( ( resolve, reject) => {
                user.authenticate(password, (err, matched) => {
                    if(err)
                        reject(err);

                    if(matched) {
                        sendJson(res, {"authentication": "success"}, 200);
                        resolve();
                    }
                    
                    else {
                        sendJson(res, {"authentication": "Wrong password."}, 404);
                        resolve();
                    }
                        

                });
            });
        
        }, err => {
            sendJson(res, {"authentication": "User does not exist"}, 404);
        })
//        .catch( err => {
//            sendJson(res, {"authentication": "Error trying to authenticate."}, 404);
//        });
}