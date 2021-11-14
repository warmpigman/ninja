"use strict";
module.exports = function (options, paguClient, user) {
    paguClient.cache.internal.users.cache.set(user.id, {
        "user": user,
        "internal": {
            eco: {},
            global: {
                cooldowns: {}
            }
        }
    });
};
