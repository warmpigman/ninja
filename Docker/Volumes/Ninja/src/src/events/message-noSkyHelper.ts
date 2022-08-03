import { Message, MessageEmbed } from "discord.js";
module.exports = {
  event: "messageCreate",
  async execute(
    client: any,
    paguClient: any,
    message: Message
  ) {
    if(message.author.id == "710143953533403226" && message.channel.id !== "673251053252247553") {
        await message.delete()
        const msg = await message.channel.send("Do not use <@710143953533403226> here, go to <#673251053252247553>")
        setTimeout(() => {
            msg.delete()
        }, 5000)
    }
  },
};
