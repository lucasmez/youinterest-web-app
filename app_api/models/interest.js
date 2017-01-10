const 	mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const interestSchema = new mongoose.Schema({
	title: {type: String, required:true},
	description: String,
	usersInterested: [Schema.Types.ObjectId]	
});

mongoose.model('Interest', interestSchema);
