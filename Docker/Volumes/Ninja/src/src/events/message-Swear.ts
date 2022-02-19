import { Message, User } from "discord.js";

module.exports = {
    event: "messageCreate",
    async execute(client: any, paguClient: any, message: Message) {
        const guildSchema = await paguClient.schemas.get("guild");
        const badWordsSchema = await paguClient.schemas.get("badWords");
        const guildData = await guildSchema.findOne({ guildID: message.guild.id });
        const badWords = await badWordsSchema.find();
        if (guildData && badWords) {
            if (message.channel.id !== guildData.regularChannel.id) {
                if (badWords.filter(word => word.severity.toLowerCase() == "vb").map(word => word.word.toLowerCase()).some(word => message.content.toLowerCase().includes(word))) {
                    message.delete();
                    message.channel.send(`${message.author.tag} has sent a very bad message. :angry:`);
                }
            } else if (badWords.filter(word => word.severity.toLowerCase() == "mb").map(word => word.word.toLowerCase()).some(word => message.content.toLowerCase().includes(word))) {
                message.delete();
                message.channel.send(`${message.author.tag} has sent a possibly bad message. :angry:`);
            }
        }
    }
}