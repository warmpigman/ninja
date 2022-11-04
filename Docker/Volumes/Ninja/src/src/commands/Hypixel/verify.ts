import axios from 'axios';

module.exports = {
  name: ["verify"],
  category: "Hypixel",
  description: "Verify your discord account with your hypixel account.",
  usage: "verify [Minecraft Username]",
  examples: ["verify Warmpigman"],
  execute(message: any, args: Array<string>, client: any, paguClient: any) {
    var embed = new paguClient.Discord.MessageEmbed()
      .setFooter(
        message.author.tag + " | " + client.user.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTimestamp()
      .setTitle("Verify");
    if (!args[0]) {
      embed.addFields({
        name: "How to verify",
        value: `Please follow the correct command format, try using, "${module.exports.usage}"`,
        // value: "1. Go to any main lobby\n2. Type \"/profile\" in the in-game chat and press enter\n3. Find the icon called \"Social Media\"\n4.Find the icon called \"Discord\"\n5.Go to the Discord app and click on your name on the bottom left to copy your Discord tag\n6. Go back in game and paste that copied tag into the chat and press enter\n7. If a book pops up, click \"I understand\"\n8. Then go try issuing this command again"
      });
      return message.channel.send({ embeds: [embed] });
    } else {
      axios({
        method: "post",
        url: "https://api.mojang.com/profiles/minecraft",
        data: JSON.stringify([args[0]]),
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: function (status) {
          return status <500;
        }
      }).then((mojangRes) => {
        if (!mojangRes.data[0].id) {
          embed.addFields({
            name: "Failed!",
            value: "Not a valid username or a mojang error occured.",
          });
          return message.channel.send({
            embeds: [embed],
          });
        } else {
          get(
            `https://api.hypixel.net/player?uuid=${mojangRes.data.id}&key=${process.env.API_KEY}`
          ).then(async (res) => {
            if (!res.data.player || !res.data.player.socialMedia) {
              embed.addFields({
                name: "How to verify",
                value:
                  '1. Go to any main lobby\n2. Type "/profile" in the in-game chat and press enter\n3. Find the icon called "Social Media"\n4.Find the icon called "Discord"\n5.Go to the Discord app and click on your name on the bottom left to copy your Discord tag\n6. Go back in game and paste that copied tag into the chat and press enter\n7. If a book pops up, click "I understand"\n8. Then go try issuing this command again',
              });
              var video = new paguClient.Discord.MessageAttachment(
                "https://i.gyazo.com/3a2358687dae9b4333fd2fef932e0a17.mp4"
              );
              return message.channel.send({ embeds: [embed], files: [video] });
            }
            if (res.data.player.socialMedia.links.DISCORD) {
              if (
                message.author.tag == res.data.player.socialMedia.links.DISCORD
              ) {
                await message.guild.roles.fetch().then(async (roles: any) => {
                  let tradeBannedRole = roles.find(
                    (r: any) => r.name.toLowerCase() === "trade ban"
                  );
                  let response = await paguClient.Util.cacheGet(
                    "https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json",
                    paguClient
                  );
                  if (!response) {
                    response = await axios.get(
                      "https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json"
                    );
                    await paguClient.Util.cacheThis(
                      {
                        key: "https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json",
                        data: response.data,
                      },
                      paguClient
                    );
                  }

                  if (
                    message.member.roles.cache.has(tradeBannedRole.ID) ||
                    response
                      ? Object.values(response.data).some(
                          (scammerUser: any) =>
                            scammerUser?.uuid === mojangRes.data.id
                        )
                      : false
                  ) {
                    await embed.addFields({
                      name: "Error!",
                      value: `Sorry, you're trade banned!`,
                    });
                  } else {
                    let tradeVerifiedRole = roles.find(
                      (r: any) => r.name.toLowerCase() === "trade verified"
                    );
                    if (tradeVerifiedRole) {
                      try {
                        await message.member.roles.add(tradeVerifiedRole);
                        await embed.addFields({
                          name: "Success!",
                          value: `Your discord and hypixel discord link matched!`,
                        });
                      } catch (e) {
                        embed.addFields({
                          name: "Error!",
                          value:
                            "I do not have sufficient permissions to add roles to you.",
                        });
                      }
                    } else {
                      embed.addFields({
                        name: "Error!",
                        value:
                          "No trade verified role found, try again when one has been made.",
                      });
                    }
                  }

                  await paguClient.Util.createNewUser(
                    paguClient,
                    message,
                    mojangRes.data.id
                  );
                });
              } else {
                embed.addFields(
                  {
                    name: "Failed!",
                    value: `Your discord and hypixel discord link did not match!`,
                  },
                  {
                    name: `Hypixel tag: ${res.data.player.socialMedia.links.DISCORD}`,
                    value: `Discord tag: ${message.author.tag}`,
                  }
                );
              }
            } else {
              await embed.addFields({
                name: "How to verify",
                value:
                  '1. Go to any main lobby\n2. Type "/profile" in the in-game chat and press enter\n3. Find the icon called "Social Media"\n4.Find the icon called "Discord"\n5.Go to the Discord app and click on your name on the bottom left to copy your Discord tag\n6. Go back in game and paste that copied tag into the chat and press enter\n7. If a book pops up, click "I understand"\n8. Then go try issuing this command again',
              });
              var video = new paguClient.Discord.MessageAttachment(
                "https://i.gyazo.com/3a2358687dae9b4333fd2fef932e0a17.mp4"
              );
              return message.channel.send({ embeds: [embed], files: [video] });
            }
            return message.channel.send({
              embeds: [embed],
              allowedMentions: { users: [] },
            });
          });
        }
      });
    }
  },
};
