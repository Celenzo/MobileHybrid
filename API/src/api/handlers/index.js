'use strict';

module.exports = (config, models) => {
    return {
        users: require('./usersHandlers')(config, models)
    }
}