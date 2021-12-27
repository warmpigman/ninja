module.exports = {
  name: ["afk"],
  category: "User",
  description: "Lets other user's when they mention you that you are afk!",
  usage: "afk <Reason>",
  examples: ["afk", "afk Eating"],
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    var embed = new paguClient.Discord.MessageEmbed()
      .setFooter(
        message.author.tag + " | " + client.user.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTimestamp();
    var userSchema = await paguClient.schemas.get("user");
    await userSchema
      .findOne({ userID: message.author.id }, async (err: Error, data: any) => {
        var afk = new Boolean();
        if (err) {
          console.log(err);
        } else if (data) {
          afk = !data.afk.afk;
          await paguClient.Util.createNewUser(paguClient, message, undefined, {
            reason: args.length == 0 ? "No reason specified" : args.join(" "),
            afk: !data.afk.afk,
          });
        } else if (!data) {
          afk = true;
          await paguClient.Util.createNewUser(paguClient, message, undefined, {
            reason: args.join(" "),
            afk: true,
          });
        }
        if (afk) {
          if (args.length == 0) {
            embed.setDescription(`**You are now afk!**`);
            message.channel.send({
              embeds: [embed],
              allowedMentions: { users: [] },
            });
          } else {
            await embed.addFields({
              name: `You are now afk!`,
              value: `Reason: ${args.join(" ")}`,
            });
            message.channel.send({
              embeds: [embed],
              allowedMentions: { users: [] },
            });
          }
        } else {
          embed.setDescription(`**You are no longer afk!**`);
          message.channel.send({
            embeds: [embed],
            allowedMentions: { users: [] },
          });
        }
      })
      .clone();
  },
};
