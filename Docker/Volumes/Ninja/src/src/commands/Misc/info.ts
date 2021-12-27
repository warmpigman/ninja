// ProNinjaGamin0: If this code breaks, it makes sense bc i wrote it
import { Message, Client, MessageEmbed } from "discord.js";

module.exports = {
  name: ["info", "information"],
  category: "Utility",
  description: "Shows information about the bot",
  usage: "info",
  examples: ["info"],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    let embed: MessageEmbed = new paguClient.Discord.MessageEmbed();
    embed
      .setTitle("Bot Info")
      .setTimestamp()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    const divmod = (x: number, y: number) => [Math.floor(x / y), x % y];
    let [uptime, milliseconds] = divmod(Number(client.uptime), 1000);
    let [days, remainder] = divmod(uptime, 86400);
    let [hours, remainder1] = divmod(remainder, 3600);
    let [minutes, seconds] = divmod(remainder1, 60);
    let uptimeStr: string = `${days} days ${hours}:${minutes}:${seconds}.${milliseconds.toFixed(
      2
    )}`;
    embed.addFields(
      { name: "Uptime", value: `${uptimeStr}`, inline: false },
      {
        name: "Latency",
        value: `${Date.now() - message.createdTimestamp}ms`,
        inline: false,
      }
    );
    embed.setFooter(
      `${message.author.username} | ${client.user?.username} `,
      message.author.avatarURL()?.toString()
    );
    embed.setThumbnail(`${client.user?.avatarURL()}`);
    message.channel.send({ embeds: [embed] });
  },
};
