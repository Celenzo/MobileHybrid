'use strict';

module.exports = (server, config, models) => {
    const handlers = require('./handlers')(config, models);
    const validations = require('./validations')();
    return require('./routes')(server, handlers, validations);
}