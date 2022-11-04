import { Message, MessageEmbed } from "discord.js";
const axios = require("axios");

module.exports = {
  name: ["weight"],
  category: "Hypixel",
  description:
    "Check the skyblock weight of a user. Optional strategies are last_save, weight, skills, slayers, catacombs or profile name.",
  usage: "weight [user] (profile)",
  examples: [
    "weight",
    "weight ProNinjaGamin0",
    "weight ProNinjaGamin0 skills",
    "weight ProNinjaGamin0 Mango",
  ],
  async execute(
    message: Message,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    message.channel.sendTyping();
    async function inner(uuid: String, strategy: String) {
      console.log(uuid, strategy);
      let url = `http://senither-weight:9281/v1/profiles/${uuid}/${strategy}?key=${process.env.API_KEY}`;
      let response = await paguClient.Util.apiCallHandler(url);
      switch (response.status) {
        case 404:
          message.channel.send("Could not find that user or profile.");
          return;
        case 500:
          message.channel.send(
            "There was an error getting the data. Please try again later."
          );
          return;
        case 502:
          message.channel.send(
            "Hypixel's API is experiencing some technical issues. Please try again later."
          );
          return;
        case 503:
          message.channel.send(
            "Hypixel's API is in maintenance. Please try again later."
          );
          return;
        case 200:
          let embed = new MessageEmbed();
          let data = response.data.data;
          let profile_name = data.name;
          let username = data.username;
          if (username == "Teodor") username = "warmpigman";
          if (username == "YoureSimple") username = "proninjagamin0";
          embed.setTitle(
            `Showing weight data for ${username}\nProfile: ${profile_name}`
          );
          embed.addField(
            "Total Weight",
            (data.weight + data.weight_overflow).toFixed(2).toString(),
            true
          );
          embed.addField("Weight", data.weight.toFixed(2).toString(), true);
          embed.addField(
            "Overflow",
            data.weight_overflow.toFixed(2).toString(),
            true
          );
          let skillsData = data.skills;
          if (!skillsData.apiEnabled) {
            embed.addField(
              "**NOTICE**",
              "This player has disabled Skills API. The following skills data may be inaccurate."
            );
          }
          let skillsText = `\`\`\`prolog
⛏️ Total Skills Weight ${(
            skillsData.weight + skillsData.weight_overflow
          ).toFixed(2)}
(${skillsData.weight.toFixed(2)} + ${skillsData.weight_overflow.toFixed(
            2
          )} Overflow)
Skill Average - ${skillsData.average_skills.toFixed(2)}
${`🌾 Farming -  ${skillsData.farming.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.farming.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.farming.weight_overflow.toFixed(2)}
${`⛏️ Mining -  ${skillsData.mining.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.mining.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.mining.weight_overflow.toFixed(2)}
${`⚔️ Combat -  ${skillsData.combat.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.combat.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.combat.weight_overflow.toFixed(2)}
${`🪓 Foraging -  ${skillsData.foraging.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.foraging.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.foraging.weight_overflow.toFixed(2)}
${`🎣 Fishing -  ${skillsData.fishing.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.fishing.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.fishing.weight_overflow.toFixed(2)}
${`🔮 Enchanting -  ${skillsData.enchanting.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.enchanting.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.enchanting.weight_overflow.toFixed(2)}
${`🧪 Alchemy -  ${skillsData.alchemy.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.alchemy.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.alchemy.weight_overflow.toFixed(2)}
${`🐾 Taming -  ${skillsData.taming.level.toFixed(2)}`.padEnd(
  22
)}| ${`Weight - ${skillsData.taming.weight.toFixed(2)}`.padEnd(
            16
          )}| Overflow - ${skillsData.taming.weight_overflow.toFixed(2)}
\`\`\``;
          embed.addField("Skills", skillsText);

          let slayerData = data.slayers;
          let bossesData = slayerData.bosses;
          let slayerText = `\`\`\`prolog
⚔️ Total Slayer Weight - ${(
            slayerData.weight + slayerData.weight_overflow
          ).toFixed(2)}
(${slayerData.weight.toFixed(2)} + ${slayerData.weight_overflow.toFixed(
            2
          )} Overflow)
${`Slayer`.padEnd(13)} | ${`Level`.padEnd(5)} | ${`Experience`.padEnd(
            10
          )} | ${`Weight`.padEnd(8)} | ${`Overflow`.padEnd(8)}
${`🧟 Revenant`.padEnd(12)} | ${bossesData.revenant.level
            .toFixed(2)
            .toString()
            .padEnd(5)} | ${bossesData.revenant.experience
            .toString()
            .padEnd(10)} | ${bossesData.revenant.weight
            .toFixed(2)
            .toString()
            .padEnd(8)} | ${bossesData.revenant.weight_overflow
            .toFixed(2)
            .toString()
            .padEnd(8)}
${`🕷️ Tarantula`.padEnd(12)} | ${bossesData.tarantula.level
            .toFixed(2)
            .toString()
            .padEnd(5)} | ${bossesData.tarantula.experience
            .toString()
            .padEnd(10)} | ${bossesData.tarantula.weight
            .toFixed(2)
            .toString()
            .padEnd(8)} | ${bossesData.tarantula.weight_overflow
            .toFixed(2)
            .toString()
            .padEnd(8)}
${`🐺 Sven`.padEnd(12)} | ${bossesData.sven.level
            .toFixed(2)
            .toString()
            .padEnd(5)} | ${bossesData.sven.experience
            .toString()
            .padEnd(10)} | ${bossesData.sven.weight
            .toFixed(2)
            .toString()
            .padEnd(8)} | ${bossesData.sven.weight_overflow
            .toFixed(2)
            .toString()
            .padEnd(8)}
${`✨ Enderman`.padEnd(11)} | ${bossesData.enderman.level
            .toFixed(2)
            .toString()
            .padEnd(5)} | ${bossesData.enderman.experience
            .toString()
            .padEnd(10)} | ${bossesData.enderman.weight
            .toFixed(2)
            .toString()
            .padEnd(8)} | ${bossesData.enderman.weight_overflow
            .toFixed(2)
            .toString()
            .padEnd(8)}
\`\`\``;
          embed.addField("Slayers", slayerText);

          let catacombsData = data.dungeons;
          let catacombsText = !(catacombsData === null)
            ? `\`\`\`prolog
🏰 Total Catacombs Weight - ${(
                catacombsData.weight + catacombsData.weight_overflow
              ).toFixed(2)}
(${catacombsData.weight.toFixed(2)} + ${catacombsData.weight_overflow.toFixed(
                2
              )} Overflow)
${catacombsData.secrets_found} Secrets Found
Catacombs Level ${catacombsData.types.catacombs.level}
${`🩹 Healer - ${catacombsData.classes.healer.level.toFixed(2)}`.padEnd(
  20
)} | Weight - ${catacombsData.classes.healer.weight
                .toFixed(2)
                .toString()
                .padEnd(
                  7
                )} | Overflow - ${catacombsData.classes.healer.weight_overflow.toFixed(
                2
              )}
${`🧙 Mage - ${catacombsData.classes.mage.level.toFixed(2)}`.padEnd(
  20
)} | Weight - ${catacombsData.classes.mage.weight
                .toFixed(2)
                .toString()
                .padEnd(
                  7
                )} | Overflow - ${catacombsData.classes.mage.weight_overflow.toFixed(
                2
              )}
${`⚔️ Berserker - ${catacombsData.classes.berserker.level.toFixed(2)}`.padEnd(
  20
)} | Weight - ${catacombsData.classes.berserker.weight
                .toFixed(2)
                .toString()
                .padEnd(
                  7
                )} | Overflow - ${catacombsData.classes.berserker.weight_overflow.toFixed(
                2
              )}
${`🏹 Archer - ${catacombsData.classes.archer.level.toFixed(2)}`.padEnd(
  20
)} | Weight - ${catacombsData.classes.archer.weight
                .toFixed(2)
                .toString()
                .padEnd(
                  7
                )} | Overflow - ${catacombsData.classes.archer.weight_overflow.toFixed(
                2
              )}
${`🛡️ Tank - ${catacombsData.classes.tank.level.toFixed(2)}`.padEnd(
  21
)} | Weight - ${catacombsData.classes.tank.weight
                .toFixed(2)
                .toString()
                .padEnd(
                  7
                )} | Overflow - ${catacombsData.classes.tank.weight_overflow.toFixed(
                2
              )}
\`\`\``
            : "Hasn't Done Dungeons";
          embed.addField("Catacombs", catacombsText);

          embed.setColor(
            `#${Math.floor(Math.random() * 16777215).toString(16)}`
          );
          embed.setFooter(
            message.author.tag + " | " + client.user.username,
            message.author.displayAvatarURL({ dynamic: true })
          );
          message.channel.send({ embeds: [embed] });
      }
    }

    if (args.length == 2) {
      let username = args[0];
      if (username.toLowerCase() == "warmpigman") username = "Teodor";
      if (username.toLowerCase() == "proninjagamin0") username = "YoureSimple";
      let strategy = args[1];
      await axios({
        method: "post",
        url: "https://api.mojang.com/profiles/minecraft",
        data: JSON.stringify([username]),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res: any) => {
          if (res.status == 200) {
            let uuid = res.data[0].id;
            inner(uuid, strategy);
          } else if ((res.status = 204)) {
            message.channel.send(
              "That username does not exist or is not a valid strategy."
            );
          } else {
            message.channel.send("An unexpected error ocurred.");
          }
        })
        .catch(async (e: any) => {
          message.channel.send(
            "There was an error in looking up the username."
          );
          return;
        });
    } else if (args.length == 1) {
      let possible = [
        "apple",
        "banana",
        "blueberry",
        "coconut",
        "cucumber",
        "grapes",
        "kiwi",
        "lemon",
        "lime",
        "mango",
        "orange",
        "papaya",
        "pear",
        "peach",
        "pineapple",
        "pomegranate",
        "raspberry",
        "strawberry",
        "tomato",
        "watermelon",
        "zucchini",
        "weight",
        "save",
        "skills",
        "slayers",
        "catacombs",
      ];
      if (possible.includes(args[0].toLowerCase())) {
        let userSchema = paguClient.schemas.get("user");
        userSchema.findOne(
          { discordID: message.author.id },
          async (err: Error, data: { mojangUUID: String }) => {
            if (!data) {
              message.reply("You need to link your account first!");
              return;
            }
            let uuid = data.mojangUUID;
            axios
              .get(`https://api.mojang.com/user/profiles/${uuid}/names`)
              .then((res: any) => {
                let strategy = args[0];
                inner(uuid, strategy);
              })
              .catch(async (e: any) => {
                message.channel.send(
                  "There was an error in looking up the username."
                );
                return;
              });
          }
        );
      } else {
        let username = args[0];
        if (username.toLowerCase() == "warmpigman") username = "Teodor";
        if (username.toLowerCase() == "proninjagamin0")
          username = "YoureSimple";
        await axios({
          method: "post",
          url: "https://api.mojang.com/profiles/minecraft",
          data: JSON.stringify([username]),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res: any) => {
            if (res.status == 200) {
              let uuid = res.data[0].id;
              let strategy = "save";
              inner(uuid, strategy);
            } else if ((res.status = 204)) {
              message.channel.send(
                "That username does not exist or is not a valid strategy."
              );
            } else {
              message.channel.send("An unexpected error ocurred.");
            }
          })
          .catch(async (e: any) => {
            message.channel.send(
              "There was an error in looking up the username."
            );
            return;
          });
      }
    } else {
      let userSchema = paguClient.schemas.get("user");
      userSchema.findOne(
        { discordID: message.author.id },
        async (err: Error, data: { mojangUUID: String }) => {
          if (!data) {
            message.reply("You need to link your account first!");
            return;
          } else {
            let uuid = data.mojangUUID;
            let response = await paguClient.Util.cacheGet(
              `https://api.mojang.com/user/profiles/${uuid}/names`,
              paguClient
            );
            if (!response) {
              axios
                .get(`https://api.mojang.com/user/profiles/${uuid}/names`)
                .then(async () => {
                  let strategy = "save";
                  inner(uuid, strategy);
                  await paguClient.Util.cacheThis(
                    {
                      key: `https://api.mojang.com/user/profiles/${uuid}/names`,
                      data: { valid: true },
                    },
                    paguClient
                  );
                })
                .catch(async (e: any) => {
                  message.channel.send(
                    "There was an error in looking up the username."
                  );
                  await paguClient.Util.cacheThis(
                    {
                      key: `https://api.mojang.com/user/profiles/${uuid}/names`,
                      data: { valid: false },
                    },
                    paguClient
                  );
                  return;
                });
            } else if (response.valid) {
              let strategy = "save";
              inner(uuid, strategy);
            } else {
              message.channel.send(
                "There was an error in looking up the username."
              );
            }
          }
        }
      );
    }
  },
};
