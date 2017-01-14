const 	mongoose = require('mongoose'),
        Schema = mongoose.Schema;


const categories = ['other', 'outdoors & adventure', 'tech', 'family', 'health', 'sports & fitness', 'learning', 'photography', 'food',
                   'writing' , 'language', 'culture', 'music', 'movements', 'lgbtq', 'film', 'sci-fi', 'games', 'beliefs', 'arts',
                   'books', 'reading', 'dance', 'pets', 'hobbies', 'crafts', 'fashion', 'beauty', 'social', 'carrer', 'business', 'investment'
                   ];

const InterestSchema = new mongoose.Schema({
	title: {type: String, required:true},
	description: String,
    tags: [String],
    category: {type: String, required: true, enum: categories},
	usersInterested: [Schema.Types.ObjectId]	
});


mongoose.model('Interest', InterestSchema);
