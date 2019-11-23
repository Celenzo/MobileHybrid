'use strict';

module.exports = db => {
    return {
        insert(user) {
            return db.users.insert(user);
        },
        get(user) {
            return db.users.findOne(user);
        }
    }
}