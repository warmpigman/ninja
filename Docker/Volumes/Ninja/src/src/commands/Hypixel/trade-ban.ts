module.exports = {
  name: ["trade-ban"],
  category: "Mod",
  description: "Ban a member from accessing the trade channel",
  usage: "trade-ban [@user or user id]",
  examples: ["trade-ban 406920919131488268", "trade-ban <@406920919131488268>"],
  permissions: ["MANAGE_MESSAGES"],
  hidden: ["mod"],
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    var target: any;
    if (message.mentions.users.first()) {
      target = message.guild.members.cache.get(
        message.mentions.users.first().id
      );
    } else if (args[0] && args[0].toString()) {
      target = await message.guild.members.cache.get(args[0].toString());
      if (!target) {
        return message.channel.send(
          "Please use the correct format, unable to find a target"
        );
      }
    } else
      return message.channel.send(
        "Please use the correct format, unable to find a target"
      );
    var embed = new paguClient.Discord.MessageEmbed()
      .setFooter(
        message.author.tag + " | " + client.user.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTimestamp();
    message.guild.roles.fetch().then(async (roles: any) => {
      let tradeBannedRole = roles.find(
        (r: any) => r.name.toLowerCase() === "trade banned"
      );
      let tradeVerifiedRole = roles.find(
        (r: any) => r.name.toLowerCase() === "trade verified"
      );
      if (tradeVerifiedRole) {
        try {
          await target.roles.remove(tradeVerifiedRole);
        } catch (e) {
          return message.channel.send({
            content:
              "I do not have sufficient permissions to remove roles from the target.",
          });
        }
        if (tradeBannedRole) {
          await target.roles.add(tradeBannedRole);
        } else {
          return message.channel.send({
            content:
              "No trade banned role found, try again when one has been made.",
          });
        }
        await embed.addFields({
          name: "Success",
          value: `<@${target.id}> has been trade banned!`,
        });
        await message.channel.send({
          embeds: [embed],
          allowedMentions: { users: [] },
        });
      } else {
        return message.channel.send({
          content:
            "No trade verified role found, try again when one has been made.",
        });
      }
    });
  },
};
