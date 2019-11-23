'use strict';

module.exports = (server, handlers, validations) => {
    server.route({
        method: 'POST',
        path: '/user/auth/login',
        config: {
            handler: handlers.users.login,
            validate: validations.login
        }
    });

    server.route({
        method: 'POST',
        path: '/user/auth/register',
        config: {
            handler: handlers.users.register,
            validate: validations.register
        }
    });
}