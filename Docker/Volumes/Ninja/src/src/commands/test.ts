module.exports = {
  name: ["hello-world"],
  category: "Dev",
  description: "Hello-world",
  usage: "eval [code]",
  examples: ["hello-world"],
  hidden: ["dev"],
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    // var embed = new paguClient.Discord.MessageEmbed()
    //     .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
    //     .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
    //     .setTimestamp()
    // message.channel.send({content: 'hi'})

    var guildSchema = await paguClient.schemas.get("guild");
    //  const a = guildSchema.findOne({guildID: message.guild.id})
    await guildSchema
      .findOne({ guildID: message.guild.id }, (err: Error, data: any) => {
        console.log("s");
        console.log(1, err);
        console.log(0, data);
      })
      .clone();
  },
};
