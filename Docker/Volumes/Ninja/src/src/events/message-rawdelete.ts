import { Message, MessageEmbed } from "discord.js";
import { text } from "stream/consumers";
module.exports = {
  event: "messageDelete",
  async execute(
    client: any,
    paguClient: any,
    message: Message,
  ) {
    const guildSchema = await paguClient.schemas.get("guild");
    const guildData = await guildSchema.findOne({
      guildID: message.guild?.id,
    });
    const mainLoggingChannel = guildData.mainLoggingChannel;
    if(!mainLoggingChannel.Set) return;

    const embed = new MessageEmbed();
    embed
      .setAuthor({  
        name: `${message.author.tag}`,
        iconURL: `${message.author.avatarURL({ dynamic: true })}`,
      })
      .setTitle(
        `🗑️\n[Message](${message.url}) sent by <#${message.author.id}> deleted in <#${message.channelId}>`
      )
      .addFields([
        { name: "Message", value: message.content ?? "None" },
      ])
      .setFooter(
        `Message ID: ${message.id} • User ID: ${message.author.id}`
      )
      .setTimestamp(Date.now())
      .setColor(`#1f94a6`);
    // await oldMessage.channel.send({});
    let attachments = [];
    for (let attachment in message.attachments) {
      attachments.push(attachment);
    }
    await mainLoggingChannel.send({
      embeds: [embed],
      attachments: attachments,
    });
  }}