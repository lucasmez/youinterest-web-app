const mongoose = require('mongoose');
const {HTTPError} = require('./errorHandler');

const User = mongoose.model('User'); //These mongoose models are saved in the require cache
const Interest = mongoose.model('Interest');

function sendJson(res, contents, status) {
	res.status(status || 200);
	res.json(contents);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


exports.getInterests = (req, res, next) => {
    if(Object.keys(req.query).length === 0) // no query
        return next( HTTPError(404, "No query parameters.") );
    
    let {title, tags, users, category, fields, limit, mode, format} = req.query;
    
    buildQuery().exec()
    .then( results => {
        if(results.length === 0)
            return next( HTTPError(404, "No interest found.") ); 
        
        if(!format || format === "id")
            return sendJson(res, results);
        
        else if(format !== "value")
            return next( HTTPError(404, "format parameter should be either 'id' or 'value'.") ); 
        
        
        replaceUserIdForName(results).then( interests => {
            sendJson(res, interests);
            
        }, err => {
            next( err );
        });
        
        
    }, err => {
        next( HTTPError(500, "Error making interest query.") );
    });
    
    
    function buildQuery() {
        let query = {},
            modee = (mode && (mode === "or")) ? "or" : "and"; //query format default to 'and'
         
            
        if(title)
            query.title = new RegExp("^"+escapeRegExp(title), "i");
        
        if(tags) {
            if(modee === "and") 
                query.tags = {$all: tags.split(",")}
            
            else 
                query.tags = {$in: tags.split(",")}; 
        }
        
        if(users) {    
            if(modee === "and") 
                query.usersInterested = {$all: users.split(",")}
            
            else 
                query.usersInterested = {$in: users.split(",")}; 
        }
        
        if(category)
            query.category = category;

        query = Interest.find(query);
        
        if(fields)
            query = query.select(fields.replace(/,/g, " "));
        
        if(limit)
            query = query.limit(parseInt(limit));
        
        return query;
    }
    
    function replaceUserIdForName(interests) {
        
        return Promise.all(interests.map( interest => {
            return User.find({_id: {$in: interest.usersInterested}}).select("name")
                    .then( users => {
                        let retInterest = {
                            _id: interest._id,
                            title: interest.title,
                            description: interest.description,
                            category: interest.category,
                            tags: interest.tags
                        };
                
                        retInterest.usersInterested = users.map( user => user.name);
                        return retInterest;
                
                    }, err => {
                        return HTTPError(500, "Error making user names queries.")
                    });
        }));
    }   
    
};

exports.getPopular = (req, res, next) => {
    let query = [
        { "$project": {
            "title": 1,
            "description": 1,
            "tags": 1,
            "category": 1,
            "usersInterested": 1,
            "users": { "$size": "$usersInterested" }
        }},

        { "$sort": { "users": -1 } },
    ];
    
    
    if(req.query && req.query.limit)
        query.push({"$limit": parseInt(req.query.limit)});
    
    query = Interest.aggregate(query);
    
    query.exec().then( popular => {
        if(popular.length === 0 )
            return next( HTTPError(404, "No popular interests.") );
            
        sendJson(res, popular);
        
    }, err =>{
        next( HTTPError(404, "No popular interests.") );
    });
};

exports.getOneInterest = (req, res, next) => {
    if(!(req.params && req.params.interestId)) {
		return next( HTTPError(404, "No interest id in request") );
	}

	Interest.findById(req.params.interestId)
		.then( (interest) => {
			if(!interest)
				return next( HTTPError(404, "Interest not found") );	

            let sendValue = {
                title: interest.title,
                description: interest.description,
                usersInterested: interest.usersInterested || []
            }
			sendJson(res, sendValue);
        
		}, (err) => {
			next( HTTPError(404, "Interest not found") );
		});

}

exports.createInterest =  (req, res, next) => {
    if(!(req.body && req.body.title && req.body.category)) {
		return next( HTTPError(400, "no title or category parameter") );
	}

	let {title, description, tags, category} = req.body;
    
    if(tags)
        tags = tags.split(",");
    
	let newInterest = new Interest({
		title: title,
		description: description || "",
        tags: tags || [],
        category: category
	});
	
	newInterest.save()
		.then( ()  => {
			sendJson(res, {"message": "Interest created."}, 201);
		}, (err) => {
			next( HTTPError(409, "Could not create interest.") );
		});
}

exports.updateInterest = (req, res, next) => {
    if(!(req.params && req.params.interestId)) {
        return next( HTTPError(404, "No interest id in request") );
    }
    
    let interestId = req.params.interestId;
    
    let {title, description, tags, category} = req.body;
    
    if(tags)
        tags = tags.split(",");

    try {
        interestId = mongoose.Types.ObjectId(interestId);
    } catch(e) {
        return next( HTTPError(404, "Interest not found") );   
    }
    
    Interest.findById(interestId).select("-usersInterested").exec()
        .then( (interest) => {
            if(!interest) 
                throw HTTPError(404, "Interest not found.");
        
            interest.title = title || interest.title;
            interest.description = description || interest.description;
            interest.tags = tags || interest.tags;
            interest.category = category || interest.category;
            
            return new Promise( (resolve, reject) => {
                interest.save()
                    .then( value => resolve(value), (err) => {
                        reject(HTTPError(400, "Could not update interest."));
                    });
            });
     

        })
        .then( () => {
            sendJson(res, {message: "Interest updated."});
        }, (err) => {
            next(err);
        });
}

exports.deleteInterest = (req, res, next) => {
    if(!(req.params && req.params.interestId)) {
        return next( HTTPError(404, "No user id in request") );
    }
    
    let interestId = req.params.interestId;
    
    try {
        interestId = mongoose.Types.ObjectId(interestId);
    } catch(e) {
        return next( HTTPError(404, "Interest not found") );   
    }
    
    Interest.findByIdAndRemove(interestId).exec()
        .then ( () => {
            sendJson(res, {message: "Interest removed."}, 204);
        }, (err) => {
            next( HTTPError(404, "Could not remove interest.") );
        });
}
