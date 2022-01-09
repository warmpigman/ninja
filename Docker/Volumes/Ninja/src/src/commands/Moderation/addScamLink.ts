module.exports = {
  name: ["add-scam-link", "addscamlink"],
  category: "Mod",
  description: "Add a scam link to the filter.",
  usage: "addscamlink [website]",
  examples: ["addscamlink google.com"],
  permissions: ["MANAGE_MESSAGES"],
  hidden: ["mod"],
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
      .setTitle("Adding Scam Link");
    var scamSchema = await paguClient.schemas.get("scam");
    var validWebsites = 0;
    if (args.length < 1) {
      embed.setDescription("Please provide a website to add.");
      return message.channel.send({
        embeds: [embed],
        allowedMentions: { users: [] },
      });
    } else {
      for (let index = 0; index < args.length; index++) {
        let website = args[index];
        if (
          new RegExp(
            "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+"
          ).test(website)
        ) {
          //should make this not recursive, instead push to a list, and then push that list.
          await scamSchema
            .findOne(
              {
                guildID: message.guild.id,
              },
              async (err: Error, data: any) => {
                if (err) {
                  await embed.addFields({
                    name: "Error",
                    value: `An error occured, please try again for ${website.toString()}.`,
                  });
                  console.log(err);
                } else if (data) {
                  if (data.scamLinks.includes(website.toString())) {
                    await embed.addFields({
                      name: "Error",
                      value: `${website.toString()} scam link already exists.`,
                    });
                  } else if (!data.scamLinks.includes(website.toString())) {
                    data.scamLinks.add(website);
                    data.save();
                    await embed.addFields({
                      name: "Success",
                      value: `${website.toString()} has been added.`,
                    });
                  }
                } else if (!data) {
                  await scamSchema.create({
                    guildID: message.guild.id,
                    scamLinks: [website],
                  });
                  await embed.addFields({
                    name: "Success",
                    value: `${website.toString()} has been added.`,
                  });
                }
                if (index == args.length - 1) {
                  return message.channel.send({
                    embeds: [embed],
                    allowedMentions: { users: [] },
                  });
                }
              }
            )
            .clone();
        } else {
          await embed.addFields({
            name: "Error",
            value: `${website.toString()} is not a valid website.`,
          });
          if (index == args.length - 1) {
            return message.channel.send({
              embeds: [embed],
              allowedMentions: { users: [] },
            });
          }
        }
      }
    }
  },
};
