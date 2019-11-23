'use strict';

const Joi = require('joi');

module.exports = () => {
 
    const login = {
        payload: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    };

    const register = {
        payload: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
            fbtoken: Joi.string().optional().allow('')
        })
    };

    return {
        login,
        register
    }
}