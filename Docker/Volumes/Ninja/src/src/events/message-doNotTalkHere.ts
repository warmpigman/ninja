import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";
module.exports = {
  event: "messageCreate",
  async execute(client: any, paguClient: any, message: Message) {
    if (message.channel.id == "899227365228576841") {
      if (message.content.includes("http")) {
        await message.member?.kick("Spoke in forbidden channel");
        message.guild?.channels.cache.forEach((channel: Channel) => {
          if (channel.isText()) {
            channel.messages.fetch({ limit: 100 }).then((msgs) => {
              msgs.forEach((msg: any) => msg.delete());
            });
          }
        });

        const guildSchema = await paguClient.schemas.get("guild");
        const guildData = await guildSchema.findOne({
          guildID: message.guild?.id,
        });
        const mainLoggingChannel = guildData.mainLoggingChannel;
        const embed = new MessageEmbed();
        embed
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.avatarURL({ dynamic: true })}`,
          })
          .setTitle(`Kicked <@${message.author.id}>`)
          .addFields([
            { name: "Reason", value: "Spoke in <#899227365228576841>" },
            { name: "Message", value: message.content },
          ])
          .setFooter(
            `Message ID: ${message.id} • User ID: ${message.author.id}`
          )
          .setTimestamp(Date.now())
          .setColor(`#0xfcba03`);
        let attachments = [];
        for (let attachment in message.attachments) {
          attachments.push(attachment);
        }
        await mainLoggingChannel.send({
          embeds: [embed],
          attachments: attachments,
        });
        const scamLinkChannel = client.cache.channels.get("937390783001157754");
        embed.setTitle("Potential Scam Link");
        embed.setColor("#0xfcba03");
        const re = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/;
        // embed.addField("Link", )
        let scamLink = message.content?.match(re)?.[0] ?? "No Link".toString();
        const remove_words = ["https://,", "http://"];

        embed.fields = [];
        embed.addFields([
          { name: "Scam Link", value: scamLink },
          { name: "Message Content", value: message.content },
        ]);

        let msgSent: Message = await scamLinkChannel.send(embed);
        msgSent.react("✅");
        msgSent.react("❌");

        const filter = (reaction: any, user: any) => {
          return (
            ["✅", "❌", "📝"].includes(reaction.emoji.name) &&
            user !== client.user &&
            reaction.message == msgSent
          );
        };

        const collector = msgSent.createReactionCollector({
          filter,
          time: 21600000,
        });
        // should check for these and put in database to check on restart
        collector.on("collect", async (reaction: any) => {
          if (reaction.emoji.name == "✅") {
            msgSent.delete();
            // add to scam link database
            const scamLinkSchema = await paguClient.schemas.get("scam");
            scamLinkSchema.create({
              website: scamLink,
            });
            const m = await msgSent.channel.send("Link added to database");
            setTimeout(() => {
              m.delete();
            }, 5000);
          }
          if (reaction.emoji.name == "❌") {
            msgSent.delete();
          }
        });
      } else {
        await message.delete();
        try {
          await message.author.send(
            `You cannot speak in <#${message.channel.id}>`
          );
        } catch {}
      }
    }
  },
};
