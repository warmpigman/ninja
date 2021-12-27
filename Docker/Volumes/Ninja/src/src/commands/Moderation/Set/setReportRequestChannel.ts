module.exports = {
  name: [
    "setreportrequestchannel",
    "set-report-request-channel",
    "set-reportrequestchannel",
  ],
  category: "Mod",
  description: "Set's the guild's report request channel to send requests to.",
  usage: "setreportrequestchannel [ID or #channel]",
  examples: [
    "setreportrequestchannel #report-requests",
    "setreportrequestchannel 212148329245020082",
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
              reportRequestChannel: {
                ID: channelID,
                Set: true,
              },
            });
            return message.reply({
              content: `<#${channelID}> has been set as the report request channel.`,
            });
          } else if (data) {
            if (data.reportRequestChannel.ID == channelID) {
              return message.reply({
                content: `<#${channelID}> is already the report request channel.`,
              });
            } else {
              data.reportRequestChannel.ID = channelID;
              data.reportRequestChannel.Set = true;
              data.save();
              return message.reply({
                content: `<#${channelID}> has been set as the report request channel.`,
              });
            }
          }
        }
      }
    );
  },
};
