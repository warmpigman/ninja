import * as Path from "path";
import * as fs from "fs";
var guildRegistar = require("../../Cache/Guilds/Generator");
var userRegistar = require("../../Cache/Users/Generator");
module.exports = function (options: any, paguClient: any) {
  try {
    options.client.guilds.cache.forEach((guild: any) => {
      guildRegistar(options, paguClient, guild);
    });
    options.client.users.cache.forEach((user: any) => {
      userRegistar(options, paguClient, user);
    });
  } catch (e) {
    paguClient.Util.log(__filename, "error", e, true);
  }
};
