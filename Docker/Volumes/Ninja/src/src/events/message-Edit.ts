import { Message, MessageEmbed, TextChannel } from "discord.js";
import { text } from "stream/consumers";
module.exports = {
  event: "messageUpdate",
  async execute(
    client: any,
    paguClient: any,
    oldMessage: Message,
    newMessage: Message
  ) {
    if(oldMessage.content == newMessage.content) return;
    const guildSchema = await paguClient.schemas.get("guild");
    const guildData = await guildSchema.findOne({
      guildID: oldMessage.guild?.id,
    });
    let mainLoggingChannel = guildData.mainLoggingChannel;
    if (!mainLoggingChannel.Set) return;

    console.log(mainLoggingChannel)
    const embed = new MessageEmbed();

    embed
      .setAuthor({
        name: `${oldMessage.author.tag}`,
        iconURL: `${oldMessage.author.avatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `📝\n[Message](${oldMessage.url}) sent by <@${oldMessage.author.id}> edited in <#${oldMessage.channelId}>`
      )
      .addFields([
        { name: "Old Message", value: oldMessage.content ?? "None" },
        { name: "New Message", value: newMessage.content ?? "None" },
      ])
      .setFooter(
        `Message ID: ${oldMessage.id} • User ID: ${oldMessage.author.id}`
      )
      .setTimestamp(Date.now())
      .setColor(`#c8cf04`);
    // await oldMessage.channel.send({});
    let attachments = [];
    for (let attachment in oldMessage.attachments) {
      attachments.push(attachment);
    }
    mainLoggingChannel = client.channels.cache.get(
      mainLoggingChannel.ID
    ) as TextChannel;
    if (mainLoggingChannel) await mainLoggingChannel.send({
      embeds: [embed],
      attachments: attachments,
    });
  },
};
