module.exports = {
  name: ["dice", "roll"],
  category: "Fun",
  description: "Roll a die between a floor and ceiling.",
  usage: "dice [floor]\ndice [floor] [ceiling]",
  examples: ["dice", "dice 420", "dice 69 420"],
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
      .setTimestamp()
      .setTitle("Dice");
    if (args.length >= 2) {
      embed.setDescription(
        `**You rolled a ${
          Math.floor(
            Number(
              `.${require("crypto")
                .randomBytes(4)
                .toString("hex")
                .split("")
                .map((letter: String) => letter.charCodeAt(0))
                .join("")}`
            ) * parseInt(args[1])
          ) + parseInt(args[0])
        }!**`
      );
      message.channel.send({ embeds: [embed], allowedMentions: { users: [] } });
    } else if (args.length == 1) {
      embed.setDescription(
        `**You rolled a ${Math.floor(
          Math.random() * (parseInt(args[0]) + 1)
        )}!**`
      );
      message.channel.send({ embeds: [embed], allowedMentions: { users: [] } });
    } else {
      embed.setDescription(
        `**You rolled a ${
          Math.floor(
            Number(
              `.${require("crypto")
                .randomBytes(4)
                .toString("hex")
                .split("")
                .map((letter: String) => letter.charCodeAt(0))
                .join("")}`
            ) * 6
          ) + 1
        }!**`
      );
      message.channel.send({ embeds: [embed], allowedMentions: { users: [] } });
    }
  },
};
