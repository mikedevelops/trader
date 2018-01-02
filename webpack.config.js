const path = require('path');
const Html = require('html-webpack-plugin');

const config = {
    entry: path.join(__dirname, 'src/index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, use: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },
    plugins: [
        new Html({
            inject: 'body',
            template: path.join(__dirname, 'src/index.html')
        })
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
}

module.exports = config;
