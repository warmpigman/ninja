import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

module.exports = {
  name: ["untimeout"],
  category: "Mod",
  description: "Untimes out a user that is timed out.",
  usage: "timeout [user] (reason)",
  examples: [
    "untimeout <@300669365563424770>",
    "untimeout <@300669365563424770> is good",
  ],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    if (args.length == 0) {
      message.channel.send("Please specify a user.");
      paguClient.commands
        .get("help")
        .commandFile.execute(message, ["untimeout"], client, paguClient);
    } else {
      if (message.guildId === null) {
        message.channel.send("This command must be used in a guild.");
      } else {
        let member_id = isNaN(parseInt(args[0]))
          ? args[0].slice(3, -1)
          : args[0];
        let guild = client.guilds.cache.get(message.guildId);
        let member = guild?.members.cache.get(member_id);
        if (member === undefined) {
          message.channel.send(
            "That user does not exist or is not a member of this server"
          );
        } else {
          let reason = args.length >= 2 ? args.slice(1).toString() : "None";
          let timestamp = new Date(Date.now());
          member
            .edit(
              { communicationDisabledUntil: timestamp.toISOString() },
              reason
            )
            .then((res: any) => {
              let guildSchema = paguClient.schemas.get("guild");
              guildSchema.findOne(
                { guildID: message.guildId },
                async (err: Error, data: { mainLoggingChannel: string }) => {
                  let mainLoggingChannel = data.mainLoggingChannel;
                  const channel: TextChannel = (await client.channels.fetch(
                    mainLoggingChannel
                  )) as TextChannel;
                  let embed = new MessageEmbed();
                  embed.setAuthor({
                    name: `${member?.user.username}`,
                    iconURL: `${member?.user.avatarURL()}`,
                  });
                  embed.setTitle("User Untimed Out");
                  embed.addFields([
                    { name: "User Untimed Out", value: `<@${member?.id}>` },
                    { name: "Moderator", value: `<@${message.author.id}>` },
                  ]);
                  embed.setTimestamp(Date.now());
                  channel.send({ embeds: [embed] });
                }
              );
            });
        }
      }
    }
  },
};
