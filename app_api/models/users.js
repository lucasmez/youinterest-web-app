const {DB_SALT_FACTOR} = require('../../config');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	name: {type: String, required: true},
    password: {type: String, required: true},
	bio: String,
	createdOn: {type: Date, "default": Date.now},
	interests: [Schema.Types.ObjectId]
});

UserSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified("password"))
        return next();
    
    bcrypt.genSalt(DB_SALT_FACTOR, (err, salt) => {
        if(err)
            return next(err);
        
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err)
                return next(err);
            
            user.password = hash;
            next();
        }); 
    });
});

UserSchema.methods.authenticate = function(inputPass, cb) {
    bcrypt.compare(inputPass, this.password, cb);
};

mongoose.model('User', UserSchema);
