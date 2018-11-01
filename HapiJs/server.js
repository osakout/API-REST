'use strict';

const Hapi = require('hapi');
const Config = require('config');
const mongoose = require('mongoose');

const todo = require('./routes/todo');

const api = Config.get('api');

const server = Hapi.server({
    "port" : 3500,
    "host" : "localhost"
});

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./test/fixtures/awesome_log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
}

const init = async () => {  

    await server.register([
        {
            plugin: require('good'),
            options,
        },
        {
            plugin: todo,
            options,
        }
    ]);

    await mongoose.connect('mongodb://localhost:27017/crime');

    await server.start();
    server.log('info', `Server running at: ${server.info.uri}`);
};

init();
