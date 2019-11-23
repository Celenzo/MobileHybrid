'use strict';

const Boom = require('boom');
const aes256 = require('aes256');
const _ = require('lodash');

const admin = require('firebase-admin');

module.exports = (config, models) => {
    
    const serviceAccount = require('../../../crespimobilehybrid-firebase-adminsdk-wowzs-fba4987333.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://crespimobilehybrid.firebaseio.com"
    });

    const pwdCipher = (pwd) => {
        const pwdArray = pwd.split("");
        const rev = pwdArray.reverse();
        const cipher = aes256.createCipher(pwdArray.join(''));
        return cipher;
    }

    return {
        login: (req, res) => {
            return models.users.get({ username: req.payload.username })
                .then(user => {
                    if (!user) {
                        return Boom.notFound();
                    }
                    const cipher = pwdCipher(req.payload.password)
                    return (cipher.decrypt(user.password) === req.payload.password ? _.omit(user, 'password') : Boom.forbidden());
                }).catch(err => Boom.badImplementation(err));
        },
        register: (req, res) => {

            const firebaseToken = req.payload.fbtoken

            const cipher = pwdCipher(req.payload.password);
            return models.users.get({ username: req.payload.username })
                .then(user => {
                    if (user) {
                        return Boom.forbidden();
                    }

                    return models.users.insert({
                        username: req.payload.username,
                        password: cipher.encrypt(req.payload.password)
                    }).then(res => {
                        if (firebaseToken && firebaseToken != '') {
                            const message = {
                                token: firebaseToken,
                                notification: {
                                    title: 'Account created',
                                    body: `Hello ${res.username}, thanks for creating an account`
                                }
                            }
                            admin.messaging().send(message)
                                .then(res => {
                                    console.log('Message successfully sent')
                                }).catch(err => {
                                    console.log('Error sending message')
                                });
                        }
                        return _.omit(res, 'password');
                    })
                }).catch(err => Boom.badImplementation(err));
        }
    }
}