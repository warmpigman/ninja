module.exports = {
    name: [
      "setscamrequestchannel",
      "set-scam-request-channel",
      "set-scamrequestchannel",
    ],
    category: "Mod",
    description: "Sets the guild's scam request channel to send requests to.",
    usage: "setscamrequestchannelchannel [ID or #channel]",
    examples: [
      "setscamrequestchannelchannel #scam-requests",
      "setscamrequestchannelchannel 212148329245020082",
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
      await guildSchema.findOne(
        {
          guildID: message.guild.id,
        },
        (err: Error, data: any) => {
          console.log(1, data);
          if (err) {
            console.log(err);
            return message.reply({
              content: `An error has occured, please try again later.`,
            });
          } else {
            if (!data) {
              guildSchema.create({
                guildID: message.guild.id,
                scamRequestChannel: {
                  ID: channelID,
                  Set: true,
                },
              });
              return message.reply({
                content: `<#${channelID}> has been set as the scam request channel.`,
              });
            } else if (data) {
              if (data.scamRequestChannel == channelID) {
                return message.reply({
                  content: `<#${channelID}> is already the scam request channel.`,
                });
              } else {
                data.scamRequestChannel.ID = channelID;
                data.scamRequestChannel.Set = true;
                data.save();
                return message.reply({
                  content: `<#${channelID}> has been set as the scam request channel.`,
                });
              }
            }
          }
        }
      );
    },
  };
  