// import { Message, MessageEmbed, TextChannel } from "discord.js";
// import { text } from "stream/consumers";
// module.exports = {
//   event: "messageDeleteBulk",
//   async execute(
//     client: any,
//     paguClient: any,
//     messages: [Message],
//   ) {
//     const guildSchema = await paguClient.schemas.get("guild");
//     //@ts-ignore
//     console.log(messages.values()[0])
//     const guildData = await guildSchema.findOne({
//       guildID: messages[0].guildId,
//     });
//     let mainLoggingChannel = guildData.mainLoggingChannel;
//     if (!mainLoggingChannel.Set) return;

//     const embed = new MessageEmbed();
//     //@ts-ignore
//     embed
//       .setAuthor({
//         name: `${client.user.tag}`,
//         iconURL: `${client.user.avatarURL({ dynamic: true })}`,
//       })
//       .setDescription(
//         `🗑️\n${messages.length} messages deleted ${messages.flatMap(message => message.channelId).length>1?`Spreading across ${messages.flatMap(message => message.channelId).length} channels`:`in <#${messages[0].channelId}>`}>`
//       )
//       .setTimestamp(Date.now())
//       .setColor(`#1f94a6`);

//     mainLoggingChannel = client.channels.cache.get(
//       mainLoggingChannel.ID
//     ) as TextChannel;
//     if (mainLoggingChannel) await mainLoggingChannel.send({
//       embeds: [embed],
//     });
//   }
// }
