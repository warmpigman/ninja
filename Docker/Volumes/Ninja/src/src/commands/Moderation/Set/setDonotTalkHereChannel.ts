module.exports = {
  name: [
    "setdonottalkherechannel",
    "set-do-not-talk-here-channel",
    "set-donottalkherechannel",
  ],
  category: "Mod",
  description: "Sets a channel to not allow any messages to be sent in.",
  usage: "setdonottalkherechannel [ID or #channel]",
  examples: [
    "setdonottalkherechannel #do-not-talk-here",
    "setdonottalkherechannel 212148329245020082",
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
        console.log(data);
        if (err) {
          console.log(err);
          return message.reply({
            content: `An error has occured, please try again later.`,
          });
        } else {
          if (!data) {
            guildSchema.create({
              guildID: message.guild.id,
              notalk: {
                ID: channelID,
                Set: true,
              },
            });
            return message.reply({
              content: `<#${channelID}> has been set as the do-not-talk-here channel.`,
            });
          } else if (data) {
            if (data.notalk == channelID) {
              return message.reply({
                content: `<#${channelID}> is already the do-not-talk-here channel.`,
              });
            } else {
              data.notalk.ID = channelID;
              data.notalk.Set = true;
              data.save();
              return message.reply({
                content: `<#${channelID}> has been set as the do-not-talk-here channel.`,
              });
            }
          }
        }
      }
    );
  },
};
