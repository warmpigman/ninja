import { Message } from "discord.js";

module.exports = function (
  args: Array<String>,
  message: Message,
  argsIndex: number,
  isCategory?: boolean
) {
  function pre() {
    if (!args[argsIndex]) {
      if (
        message &&
        message.mentions.channels.size > 0 &&
        message.mentions.channels.first()
      ) {
        // @ts-ignore
        return message.mentions.channels.first().id;
      } else {
        return "none";
      }
      // throw new Error("No channel specified.")
    } else if (
      args[argsIndex].startsWith("<#") &&
      args[argsIndex].endsWith(">")
    ) {
      var req = args[argsIndex].replace("<#", "").replace(">", "");
      return req;
    } else if (args[argsIndex].startsWith("#")) {
      return args[argsIndex].replace("#", "");
    } else if (
      message.guild &&
      message.guild.channels.cache.get(args[argsIndex].toString())
    ) {
      // @ts-ignore
      return message.guild.channels.cache.get(args[argsIndex].toString()).id;
    } else {
      return "none";
    }
  }
  const ID = pre();
  if (ID == "none") {
    return "none";
  } else {
    if (isCategory) {
      // @ts-ignore
      if (message.guild.channels.cache.get(ID).type == "GUILD_CATEGORY") {
        return ID;
      } else {
        return "none";
      }
    } else if (!isCategory) {
      // @ts-ignore
      if (message.guild.channels.cache.get(ID).type !== "GUILD_CATEGORY") {
        return ID;
      } else {
        return "none";
      }
    } else return "none";
  }
};
