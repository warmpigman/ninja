import { Message, MessageEmbed, TextChannel } from "discord.js";
import { text } from "stream/consumers";
module.exports = {
  event: "messageDelete",
  async execute(client: any, paguClient: any, message: Message) {
    const guildSchema = await paguClient.schemas.get("guild");
    const guildData = await guildSchema.findOne({
      guildID: message.guild?.id,
    });
    let mainLoggingChannel = guildData.mainLoggingChannel;
    if (!mainLoggingChannel.Set) return;

    const embed = new MessageEmbed();
    //@ts-ignore
    if (message.content?.id) message.content = "MESSAGE IS EMBED.";
    embed
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.avatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `🗑️\n[Message](${message.url}) sent by ${message.author} deleted in <#${message.channelId}>`
      )
      .addFields([
        // { name: "Sent by", value: `<@${message.author.id}>` },
        // { name: "Channel", value: `<#${message.channelId}>` },
        { name: "Message", value: message.content ?? "None" },
      ])
      .setFooter(`Message ID: ${message.id} • User ID: ${message.author.id}`)
      .setTimestamp(Date.now())
      .setColor(`#1f94a6`);
    // await oldMessage.channel.send({});
    let attachments = [];
    for (let attachment in message.attachments) {
      attachments.push(attachment);
    }
    mainLoggingChannel = client.channels.cache.get(
      mainLoggingChannel.ID
    ) as TextChannel;
    if (mainLoggingChannel)
      await mainLoggingChannel.send({
        embeds: [embed],
        attachments: attachments,
      });
  },
};
