import { Message } from "discord.js";

module.exports = function (args: Array<String>, message: Message, argsIndex: number) {
    if (!args[argsIndex]) {
        if (message && message.mentions.channels.size > 0 && message.mentions.channels.first()) {
            // @ts-ignore
            return message.mentions.channels.first().id
        } else {
            return "none"
        }
        // throw new Error("No channel specified.")
    } else if (args[argsIndex].startsWith("<#") && args[argsIndex].endsWith(">")) {
        args[argsIndex] = args[argsIndex].replace("<#", "").replace(">", "")
        return args[argsIndex]
    } else if (args[argsIndex].startsWith("#")) {
        return args[argsIndex].replace("#", "")
    } else if (message.guild && message.guild.channels.cache.get(args[argsIndex].toString())) {
        // @ts-ignore
        return message.guild.channels.cache.get(args[argsIndex].toString()).id
    } else {
        return "none"
    }
}
