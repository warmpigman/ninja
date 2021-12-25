module.exports = {
  name: ["setverifiedrole", "set-verified-role", "set-verifiedrole"],
  category: "Mod",
  description: "Set's the guild's verified role to mute people with.",
  usage: "setmuterequestrole [ID or #role]",
  examples: ["setverifiedrole @verified", "setverifiedrole 212148329245020082"],
  permissions: ["MANAGE_roleS"],
  hidden: ["mod"],
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    if ((await paguClient.Util.resolveRole(args, message, 0)) == "none") {
      console.log(
        (await paguClient.Util.resolveRole(args, message, 0)) == "none"
      );
      return message.reply(`You must specify a valid role to set.`);
    }
    var roleID = await paguClient.Util.resolveRole(args, message, 0);
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
              verifiedRole: {
                ID: roleID,
                Set: true,
              },
            });
            return message.reply({
              content: `<@&${roleID}> has been set as the verified role.`,
              allowedMentions: {},
            });
          } else if (data) {
            if (data.verifiedRole.ID == roleID) {
              return message.reply({
                content: `<@&${roleID}> is already the verified role.`,
              });
            } else {
              data.verifiedRole.ID = roleID;
              data.verifiedRole.Set = true;
              data.save();
              return message.reply({
                content: `<@&${roleID}> has been set as the verified role.`,
              });
            }
          }
        }
      }
    );
  },
};
