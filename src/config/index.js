module.exports = {
    yt_videos_max: 10,  // Max numbers of youtube videos to show on VideoList component
    search_delay: 500,  // Search bar delay in milliseconds
    api_keys: {
        youtube: node.ENV.YOUTUBE_KEY || "Enter dev key"
    }
};