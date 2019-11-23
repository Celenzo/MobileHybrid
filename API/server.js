'use strict'

const hapi = require('hapi');
const config = require('./config')();

const init = async() => {
    try {
        const server = new hapi.server({
            host: config.api.host,
            port: config.api.port,
            routes: { cors: true }
        });
        require('./src')(server, config);
        await server.start();
        return server;
    } catch (err) {
        throw err;
    }
};

init().then(server => {
    console.log(`Server running at ${server.info.uri}`);
}).catch(err => {
    console.error(err);
    process.exit(1);
});