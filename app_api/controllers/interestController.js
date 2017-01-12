const mongoose = require('mongoose');
const {HTTPError} = require('./errorHandler');

const User = mongoose.model('User'); //These mongoose models are saved in the require cache
const Interest = mongoose.model('Interest');

function sendJson(res, contents, status) {
	res.status(status || 200);
	res.json(contents);
}

exports.getInterestByName = (req, res, next) => {
     if(!(req.query && req.query.title)) {
        return next( HTTPError(404, "No title parameter in request") );
    }

    Interest.find({title: req.query.title})
        .then( interest => {
            if(!interest.length)
                return next( HTTPError(404, "Interest not found") );	

            interest = interest[0];
        
             let sendValue = {
                title: interest.title,
                description: interest.description,
                usersInterested: interest.usersInterested || []
            }
			sendJson(res, sendValue);
        
        }, err => {
            next( HTTPError(404, "Interest not found") );
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
    if(!(req.body && req.body.title)) {
		return next( HTTPError(400, "no title parameter") );
	}

	let {title, description} = req.body;
    
	let newInterest = new Interest({
		title,
		description: description || ""
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
    
    let {title, description} = req.body;
    if(!(title || description)) {
        return next( HTTPError(404, "No title or description in body") );
    }
    
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
