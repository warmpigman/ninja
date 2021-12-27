import { Message } from "discord.js";

module.exports = function (
  args: Array<String>,
  message: Message,
  argsIndex: number
) {
  function pre() {
    if (!args[argsIndex]) {
      if (
        message &&
        message.mentions.roles.size > 0 &&
        message.mentions.roles.first()
      ) {
        // @ts-ignore
        console.log(message.mentions.roles.first().id);
        // @ts-ignore
        return message.mentions.roles.first().id;
      } else {
        return "none";
      }
      // throw new Error("No channel specified.")
    } else if (
      args[argsIndex].startsWith("<@&") &&
      args[argsIndex].endsWith(">")
    ) {
      var req = args[argsIndex].replace("<@&", "").replace(">", "");
      return req;
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
  return ID;
};
