import { Message, Client, MessageEmbed, Permissions } from "discord.js";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
  name: ["user-info", "userinfo", "ui"],
  category: "User",
  description: "Shows information about a user",
  usage: "user-info (user)",
  examples: [
    "user-info",
    "ui",
    "user-info <@300669365563424770>",
    "ui <@406920919131488268>",
  ],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    let embed = new MessageEmbed();
    embed.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    embed.setTimestamp();
    embed.setFooter(
      `Requested by ${message.author.username} | ${message.author.id}`,
      `${message.author.avatarURL({ dynamic: true })}`
    );

    let member_id =
      args.length > 0
        ? isNaN(parseInt(args[0]))
          ? args[0].slice(2, -1)
          : args[0]
        : message.author.id;
    let member = await message.guild?.members.fetch(member_id);
    let user = await client.users.fetch(member_id);

    if (user === undefined) {
      message.channel.send("That user does not exist");
    } else {
      embed.setThumbnail(`${user.avatarURL({ dynamic: true })}`);
      embed.addFields([
        {
          name: `User Info for ${user.username}`,
          value: `UserID: ${user.id}`,
          inline: true,
        },
        {
          name: `Created At`,
          value: `${user.createdAt.toLocaleDateString(
            "en-GB"
          )}, at ${user.createdAt.toLocaleTimeString("en-GB")}`,
          inline: true,
        },
      ]);
      if (!(member === undefined)) {
        let permissionArr = member?.permissions.toArray();
        let permissionText = ``;
        for (let i = 0; i < Math.min(permissionArr.length, 10); i++) {
          permissionText +=
            capitalizeFirstLetter(
              `${permissionArr.at(i)?.replaceAll("_", " ")}`
            ) + ", ";
        }
        if (permissionText === "") {
          permissionText = "None";
        } else {
          permissionText = permissionText.slice(0, -2);
        }
        let userStatusText = "";
        if (member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
          userStatusText += "Administrator ";
        }
        if (member?.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
          userStatusText += "Moderator";
        }
        let premiumText = "";
        if (!(member.premiumSince === null)) {
          premiumText += `${member?.premiumSince?.toLocaleDateString(
            "en-GB"
          )}, at ${member?.premiumSince?.toLocaleTimeString("en-GB")}`;
        } else {
          premiumText += "Not Boosting";
        }
        embed.addFields([
          {
            name: `Joined Server At`,
            value: `${member?.joinedAt?.toLocaleDateString(
              "en-GB"
            )}, at ${member?.joinedAt?.toLocaleTimeString("en-GB")}`,
            inline: true,
          },
          { name: `User Status`, value: userStatusText, inline: true },
          { name: `Server Permissions`, value: permissionText, inline: true },
          { name: `Boosting Since`, value: premiumText, inline: true },
        ]);
      }

      message.channel.send({ embeds: [embed] });
    }
  },
};
