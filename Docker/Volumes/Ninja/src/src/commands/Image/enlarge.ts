import { Message, Client, MessageEmbed, User } from "discord.js";
const fs = require("fs");
const axios = require("axios");

function emojiUnicode(emoji: any) {
  var comp;
  if (emoji.length === 1) {
    comp = emoji.charCodeAt(0);
  }
  comp =
    (emoji.charCodeAt(0) - 0xd800) * 0x400 +
    (emoji.charCodeAt(1) - 0xdc00) +
    0x10000;
  if (comp < 0) {
    comp = emoji.charCodeAt(0);
  }
  return comp.toString("16");
}

module.exports = {
  name: ["enlarge"],
  category: "Image",
  description: "Enlarges the emoji specified",
  usage: "enlarge [emoji]",
  examples: [
    "enlarge <:eco:866070829270564886>",
    "enlarge 866070829270564886",
    "enlarge 🖼️",
  ],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    if (args.length === 0) {
      message.channel.send("You must specify an emoji to enlarge");
      return;
    }
    let id = isNaN(parseInt(args[0]))
      ? args[0].includes(":")
        ? args[0].slice(args[0].lastIndexOf(":") + 1, -1)
        : args[0]
      : args[0];
    fs.readdir(
      "/application/attachments/72x72/",
      (err: any, files: Array<any>) => {
        let splitEmoji = [...id];
        let unicodeChars: String[] = [];
        for (let char of splitEmoji) {
          if (char == "️") {
            unicodeChars.push("feof");
          } else if (char == "‍") {
            unicodeChars.push("200d");
          } else {
            unicodeChars.push(emojiUnicode(char));
          }
        }

        let filename = unicodeChars.join("-") + ".png";
        if (files.includes(filename)) {
          message.channel.send({
            files: [`/application/attachments/72x72/${filename}`],
          });
          return;
        } else {
          const emoji_url_gif = `https://cdn.discordapp.com/emojis/${id}.gif`;

          axios
            .get(emoji_url_gif)
            .then((res: { status: number }) => {
              var embed = new MessageEmbed();
              embed.setImage(`https://cdn.discordapp.com/emojis/${id}.gif`);
              embed.setTimestamp();
              embed.setFooter(
                `${message.author.username} | ${client.user?.username}`,
                message.author.avatarURL()?.toString()
              );
              message.channel.send({ embeds: [embed] });
            })
            .catch(function (error: any) {
              if (error.response.status == 415) {
                var embed = new MessageEmbed();
                embed.setImage(`https://cdn.discordapp.com/emojis/${id}.png`);
                embed.setTimestamp();
                embed.setFooter(
                  `${message.author.username} | ${client.user?.username}`,
                  message.author.avatarURL()?.toString()
                );
                message.channel.send({ embeds: [embed] });
              } else if (error.response.status == 404) {
                message.channel.send("That emoji does not exist");
              } else {
                message.channel.send("There was an error in getting the emoji");
              }
            });
        }
      }
    );
  },
};
