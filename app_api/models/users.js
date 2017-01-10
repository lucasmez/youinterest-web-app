const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	name: {type: String, required: true},
	bio: String,
	createdOn: {type: Date, "default": Date.now},
	interests: [Schema.Types.ObjectId]
});

mongoose.model('User', userSchema);
