module.exports = {
  name: [
    "setregularrequestchannel",
    "set-regular-request-channel",
    "set-regularrequestchannel",
  ],
  category: "Mod",
  description: "Set's the guild's regular request channel",
  usage: "setregularrequestchannel [ID or #channel]",
  examples: [
    "setregularrequestchannel #regulars",
    "setregularrequestchannel 212148329245020082",
  ],
  permissions: ["MANAGE_CHANNELS"],
  hidden: ["mod"],
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    if (
      (await paguClient.Util.resolveChannel(args, message, 0, false)) == "none"
    ) {
      return message.reply(`You must specify a valid channel to set.`);
    }
    var channelID = await paguClient.Util.resolveChannel(
      args,
      message,
      0,
      false
    );
    const guildSchema = await paguClient.schemas.get("guild");
    guildSchema.findOne(
      {
        guildID: message.guild.id,
      },
      (err: Error, data: any) => {
        if (err) {
          console.log(err);
          return message.reply({
            content: `An error has occured, please try again later.`,
          });
        } else {
          if (!data) {
            guildSchema.create({
              guildID: message.guild.id,
              regularChannel: {
                ID: channelID,
                Set: true,
              },
            });
            return message.reply({
              content: `<#${channelID}> has been set as the regulars channel.`,
            });
          } else if (data) {
            if (data.regularChannel.ID == channelID) {
              return message.reply({
                content: `<#${channelID}> is already the regulars channel.`,
              });
            } else {
              data.regularChannel.ID = channelID;
              data.regularChannel.Set = true;
              data.save();
              return message.reply({
                content: `<#${channelID}> has been set as the regulars channel.`,
              });
            }
          }
        }
      }
    );
  },
};
