const webpack = require('webpack');

module.exports = {
    entry: './src/app.jsx',
    output: {
        path: __dirname,
        filename: './public/javascripts/app.js'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {
            config: 'src/config/index.js',
            Main: 'src/components/Main.jsx',
            Search: 'src/components/Search.jsx',
            SearchResults: 'src/components/SearchResults.jsx',
            SiteBar: 'src/components/SiteBar.jsx',
            Interest: 'src/components/interest_page/Interest.jsx',
            InterestAbout: 'src/components/interest_page/InterestAbout.jsx',
            InterestUsers: 'src/components/interest_page/InterestUsers.jsx',
            InterestVideos: 'src/components/interest_page/InterestVideos.jsx',
            InterestMeetups: 'src/components/interest_page/InterestMeetups.jsx',
            InterestDiscussion: 'src/components/interest_page/InterestDiscussion.jsx',
            MainPage: 'src/components/main_page/MainPage.jsx',
            MainPagePopular: 'src/components/main_page/MainPagePopular.jsx',
            MainPageDigest: 'src/components/main_page/MainPageDigest.jsx',
            InterestItem: 'src/components/InterestItem.jsx',
            Matches: 'src/components/Matches.jsx',
            UserProfile: 'src/components/UserProfile.jsx',
            MeetupItem: 'src/components/interest_page/MeetupItem.jsx',
            VideoPlayer: 'src/components/youtube_video/VideoPlayer.jsx',
            VideoList: 'src/components/youtube_video/VideoList.jsx'
        }
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015', 'es2016'],
                    "env": {
                        "production": {
                                "presets": ["babili"]
                        }
                    }
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|config|app_api|app_server)/
            },
            {
                loader: 'json-loader',
                test: /\.json$/
            }
        ]
    }
}