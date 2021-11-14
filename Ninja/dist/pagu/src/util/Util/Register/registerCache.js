"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guildRegistar = require('../../Cache/Guilds/Generator');
var userRegistar = require('../../Cache/Users/Generator');
module.exports = function (options, paguClient) {
    try {
        options.client.guilds.cache.forEach((guild) => {
            guildRegistar(options, paguClient, guild);
        });
        options.client.users.cache.forEach((user) => {
            userRegistar(options, paguClient, user);
        });
    }
    catch (e) {
        paguClient.Util.log(__filename, "error", e, true);
    }
};
