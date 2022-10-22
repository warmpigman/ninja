import { Message } from "discord.js";
import "axios";
import { PermissionFlagsBits } from "discord-api-types";

module.exports = {
    event: "messageCreate",
    async execute(client: any, paguClient: any, message: Message) {
        if (message.mentions.users.size < 4 || message.member?.permissions.has(PermissionFlagsBits.ModerateMembers, true)) {
            return
        }
        const guildSchema = await paguClient.schemas.get("guild");
        const guildData = await guildSchema.findOne({
        guildID: message.guild?.id,
        });
        const mainLoggingChannel = guildData.mainLoggingChannel;
        await message.delete();
        if (message.mentions.users.size >= 15) {
            await message.member?.kick("Spammed Mentions");
            try {
                await message.author.send("You can not spam so many mentions!");
            }
            catch (e) {

            }
        }
        else if (message.mentions.users.size >= 7) {
            await message.member?.timeout(300000, "Spammed Mentions");
            await message.delete();
            await message.channel.send(`<@${message.author.id} You cant spam so many mentions!`);
        }
        else {
            await message.delete();
            await message.channel.send(`<@${message.author.id} You cant spam so many mentions!`);
        }

    }
}