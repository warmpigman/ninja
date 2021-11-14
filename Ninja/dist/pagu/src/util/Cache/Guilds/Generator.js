"use strict";
module.exports = function (options, paguClient, guild) {
    paguClient.cache.internal.guilds.cache.set(guild.id, {
        "guild": guild,
        "internal": {
            eco: {},
            cooldowns: {}
        }
    });
};
