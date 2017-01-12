module.exports = {
    entry: './src/app.jsx',
    output: {
        path: __dirname,
        filename: './public/javascripts/bundle.js'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'es2016']
                },
                test: /\.jsx$/,
                exclude: /(node_modules|config|app_api|app_server)/
            }
        ]
    }
}