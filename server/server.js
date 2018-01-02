const express = require('express');
const app = express();
const readline = require('readline');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../webpack.config');
const compiler = webpack(config);
const path = require('path');

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

/**
 * Poll a URL with a GET request
 * @param {*} url
 * @param {*} interval
 * @param {*} update
 * @param {*} error
 */
function poll (request, interval, update, error) {
    request();

    return setInterval(() => {
        request();
    }, interval);
}

/**
 * Make spot request
 * @param {*} error
 * @param {*} update
 */
function spotRequest (error, update) {
    request('https://api.coinbase.com/v2/prices/ETH-GBP/spot', (err, response, body) => {
        if (err) {
            error(err);
        }

        update(body);
    });
}

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

io.on('connection', (socket) => {
    console.log('client connected');

    const interval = poll(
        spotRequest.bind(
            null,
            error => console.log(error),
            res => {
                const { data } = JSON.parse(res);

                socket.emit('message', data.amount);
            }
        ),
        2000
    );

    socket.on('disconnect', () => {
        console.log('diconnecting socket and clearing interval');
        clearInterval(interval);
    });
});

http.listen('8888', () => {
    console.log('Server started on :8888');
});
