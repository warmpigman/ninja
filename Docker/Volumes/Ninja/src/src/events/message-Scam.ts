import { Message, TextChannel } from "discord.js";

module.exports = {
  event: "messageCreate",
  async execute(client: any, paguClient: any, message: Message) {
    var embed = new paguClient.Discord.MessageEmbed()
      .setFooter(
        message.author.tag + " | " + client.user.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTimestamp()
      .setTitle("Scam Message");
    var scamSchema = await paguClient.schemas.get("scam");
    var scamData = await scamSchema.find({});
    // console.log(scamData, 2)
    if (scamData) scamData = scamData.map((data: any) => data.website);
    var guildSchema = await paguClient.schemas.get("guild");
    var guildData = await guildSchema.findOne({ guildID: message.guild?.id });
    // console.log(guildData);
    var guildDataScams;
    if (guildData) guildDataScams = guildData.scamLinks;
    if (scamData && guildData) scamData.concat(guildDataScams);
    else if (!scamData && guildData) scamData = guildDataScams;
    if (scamData)
      scamData = scamData.map((data: any) => data.toLowerCase()).join("|");
    else if (!scamData) return;
    if (new RegExp(scamData).test(message.content.toLowerCase())) {
      if (
        scamData.length > 0 &&
        new RegExp(scamData).test(message.content.toLowerCase())
      ) {
        message.delete();
        embed.setDescription(`${message.author.tag} has sent a scam message.`);
        // send this to mod logs otherwise none.
        if (guildData) {
          if (guildData.mainLoggingChannel.Set) {
            const channel = message.guild?.channels.cache.get(
              guildData.mainLoggingChannel.ID
            );
            if (channel && channel.type == "GUILD_TEXT") {
              channel.send({
                embeds: [embed],
                allowedMentions: { users: [] },
              });
            }
          }
        }
      }
    }
  },
};
