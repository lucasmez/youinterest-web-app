const yt_videos_max = require('../config').yt_videos_max;
const youtube_key = require('../config').api_keys.youtube;
const YTSearch = require('youtube-api-search');


module.exports.search = (searchTerm, cb) => {
    YTSearch({term: searchTerm, key: youtube_key}, videos => {
        console.log(videos);
        cb(videos);
    });
}
