'use strict';

module.exports = (server, config) => {
    return require('./models')(config).then(models => {
        return require('./api')(server, config, models)
    });
}