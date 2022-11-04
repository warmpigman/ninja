import { Message, Client, MessageEmbed } from "discord.js";
import pagu = require("../../../pagu/pagu");

const axios = require("axios");

const getActiveProfile = function (profiles: any, uuid: any) {
  return profiles.sort(
    (a: any, b: any) => b.members[uuid].last_save - a.members[uuid].last_save
  )[0];
};

const getProfileByName = function (profiles: any, name: String) {
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].cute_name.toLowerCase() === name.toLowerCase()) {
      return profiles[i];
    }
  }
  return null;
};

function abbreviateNumber(value: any) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

module.exports = {
  name: ["networth", "nw"],
  category: "Hypixel",
  description:
    "Shows the networth of yourself or a player. You may choose a specific profile.",
  usage: "nw (user) (profile)",
  examples: ["nw", "networth", "nw ProNinjaGamin0", "nw Warmpigman Apple"],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    const key = process.env.API_KEY;
    let m = await message.reply({
      content: "<a:loading:925859228374142977> Loading...",
      allowedMentions: { repliedUser: false },
    });
    async function inner(
      uuid: string,
      profile: any,
      username: string,
      cute_name: string
    ) {
      try {
        const response = await axios.post(
          "http://maro-api:3000/api/networth/categories",
          { data: profile }
        );

        let embed = new MessageEmbed();
        embed.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        embed.setTimestamp(Date.now());
        embed.setFooter(
          `Profile: ${cute_name}`,
          message.author.displayAvatarURL({ dynamic: true })
        );
        embed.setThumbnail(`https://mc-heads.net/head/${username}`);
        const data = response.data.data;
        const total_networth: number = data.networth + data.bank + data.purse;
        const bankValue =
          data.bank === null
            ? "0"
            : abbreviateNumber(Math.round(data.bank)).toString();
        const purseValue =
          data.purse === null
            ? "0"
            : abbreviateNumber(Math.round(data.purse)).toString();
        const sackValue =
          data.sacks === null
            ? "0"
            : abbreviateNumber(Math.round(data.sacks)).toString();
        embed.setDescription(
          `**[${username}](https://sky.shiiyu.moe/stats/${username}/${cute_name})**\n${username}'s networth is $${new Intl.NumberFormat(
            "en-US"
          ).format(Math.round(total_networth))} (${abbreviateNumber(
            Math.round(total_networth)
          )})`
        );
        embed.addFields([
          { name: ":pig: Purse", value: purseValue, inline: true },
          { name: ":coin: Bank", value: bankValue, inline: true },
          { name: ":handbag: Sack's Value", value: sackValue, inline: true },
        ]);
        let storageText = ``;
        let inventoryText = ``;
        let enderchestText = ``;
        let wardrobeText = ``;
        let petsText = ``;
        let talismansText = ``;
        let categories = data.categories;
        let storage = categories.storage;
        let inventory = categories.inventory;
        let enderchest = categories.enderchest;
        let wardrobe = categories.wardrobe_inventory;
        let pets = categories.pets;
        let talismans = categories.talismans;

        if (storage !== undefined) {
          for (let i = 0; i < Math.min(storage.top_items.length, 5); i++) {
            storageText += `${storage.top_items[i].name} → ${abbreviateNumber(
              storage.top_items[i].price
            )}\n`;
          }
        }
        if (inventory !== undefined) {
          for (let i = 0; i < Math.min(inventory.top_items.length, 5); i++) {
            inventoryText += `${
              inventory.top_items[i].name
            } → ${abbreviateNumber(inventory.top_items[i].price)}\n`;
          }
        }
        if (enderchest !== undefined) {
          for (let i = 0; i < Math.min(enderchest.top_items.length, 5); i++) {
            enderchestText += `${
              enderchest.top_items[i].name
            } → ${abbreviateNumber(enderchest.top_items[i].price)}\n`;
          }
        }
        if (wardrobe !== undefined) {
          for (let i = 0; i < Math.min(wardrobe.top_items.length, 5); i++) {
            wardrobeText += `${wardrobe.top_items[i].name} → ${abbreviateNumber(
              wardrobe.top_items[i].price
            )}\n`;
          }
        }
        if (pets !== undefined) {
          for (let i = 0; i < Math.min(pets.top_items.length, 5); i++) {
            petsText += `${pets.top_items[i].name} → ${abbreviateNumber(
              pets.top_items[i].price
            )}\n`;
          }
        }
        if (talismans !== undefined) {
          for (let i = 0; i < Math.min(talismans.top_items.length, 5); i++) {
            talismansText += `${
              talismans.top_items[i].name
            } → ${abbreviateNumber(talismans.top_items[i].price)}\n`;
          }
        }
        if (storageText === "") storageText = "Storage API Disabled";
        if (inventoryText === "") inventoryText = "Inventory API Disabled";
        if (enderchestText === "") enderchestText = "Enderchest API Disabled";
        if (wardrobeText === "") wardrobeText = "Wardrobe API Disabled";
        if (petsText === "") petsText = "Pets API Disabled";
        if (talismansText === "") talismansText = "Talismans API Disabled";

        let storageTotal =
          storage === undefined ? "0" : abbreviateNumber(storage.total);
        let inventoryTotal =
          inventory === undefined ? "0" : abbreviateNumber(inventory.total);
        let enderchestTotal =
          enderchest === undefined ? "0" : abbreviateNumber(enderchest.total);
        let wardrobeTotal =
          wardrobe === undefined ? "0" : abbreviateNumber(wardrobe.total);
        let petsTotal = pets === undefined ? "0" : abbreviateNumber(pets.total);
        let talismansTotal =
          talismans === undefined ? "0" : abbreviateNumber(talismans.total);
        embed.addFields([
          {
            name: `Storage Value: ${storageTotal}`,
            value: storageText,
          },
          {
            name: `Inventory Value: ${inventoryTotal}`,
            value: inventoryText,
          },
          {
            name: `Enderchest Value: ${enderchestTotal}`,
            value: enderchestText,
          },
          {
            name: `Wardrobe Value: ${wardrobeTotal}`,
            value: wardrobeText,
          },
          {
            name: `Pets Value: ${petsTotal}`,
            value: petsText,
          },
          {
            name: `Talismans Value: ${talismansTotal}`,
            value: talismansText,
          },
        ]);
        m.edit({
          content: null,
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        });
      } catch (e: any) {
        console.log(e);
        message.channel.send("An error occurred. Please report this!")
        // if (e.response === undefined)
        //   m.edit({
        //     content: `There was an error`,
        //     allowedMentions: { repliedUser: false },
        //   });
        // else if (e.response.data === undefined)
        //   m.edit({
        //     content: `There was an error`,
        //     allowedMentions: { repliedUser: false },
        //   });
        // else if (e.reponse?.data.status === undefined)
        //   m.edit({
        //     content: `There was an error`,
        //     allowedMentions: { repliedUser: false },
        //   });
        // else {
        //   let embed = new MessageEmbed();
        //   embed.setTitle("Error");
        //   embed.setColor(
        //     `#${Math.floor(Math.random() * 16777215).toString(16)}`
        //   );
        //   embed.setTimestamp(Date.now());
        //   embed.setFooter(
        //     message.author.username,
        //     message.author.displayAvatarURL({ dynamic: true })
        //   );
        //   embed.addField(
        //     e.response.data.status.toString(),
        //     e.response.data.cause
        //   );
        //   m.edit({
        //     content: null,
        //     embeds: [embed],
        //     allowedMentions: { repliedUser: false },
        //   });
        //  }
      }
    }
    async function get(key: string, uuid: string) {
      let response = await paguClient.Util.cacheGet(key, paguClient);
      if (response) return response;
      else {
        response = await axios.get(
          `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
        );
        await paguClient.Util.cacheThis(
          { key: key, data: response },
          paguClient
        );
        return response;
      }
    }
    if (args.length == 0) {
      let userSchema = paguClient.schemas.get("user");
      userSchema.findOne(
        { discordID: message.author.id },
        async (err: Error, schemaData: { mojangUUID: string }) => {
          if (!schemaData) {
            m.edit("You need to link your account first!");
            return;
          }
          const uuid = schemaData.mojangUUID;
          const { data } = await get(key ?? "", uuid);
          const activeProfile = getActiveProfile(data.profiles, uuid);
          const profile = activeProfile.members[uuid];
          profile.banking = activeProfile.banking;

          const resp = await axios.get(
            `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
          );
          const username = resp.data.name;
          await inner(uuid, profile, username, activeProfile.cute_name);
        }
      );
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
      if (possible.includes(args[0])) {
        let userSchema = paguClient.schemas.get("user");
        userSchema.findOne(
          { discordID: message.author.id },
          async (err: Error, schemaData: { mojangUUID: string }) => {
            if (!schemaData) {
              m.edit("You need to link your account first!");
              return;
            }
            const uuid = schemaData.mojangUUID;
            const { data } = await get(key ?? "", uuid);
            const activeProfile = getProfileByName(data.profiles, args[0]);
            const profile = activeProfile.members[uuid];
            profile.banking = activeProfile.banking;

            const resp = await axios.get(
              `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
            );
            const username = resp.data.name;
            await inner(uuid, profile, username, activeProfile.cute_name);
          }
        );
      } else {
        const resp = await axios({
          method: "post",
          url: "https://api.mojang.com/profiles/minecraft",
          data: JSON.stringify([args[0]]),
          headers: {
            "Content-Type": "application/json",
          },
        })
        const uuid = resp.data[0].id;
        const username = resp.data[0].name;
        const { data } = await get(key ?? "", uuid);
        const activeProfile = getActiveProfile(data.profiles, uuid);
        const profile = activeProfile.members[uuid];
        profile.banking = activeProfile.banking;
        await inner(uuid, profile, username, activeProfile.cute_name);
      }
    } else if (args.length == 2) {
      const resp = await axios({
        method: "post",
        url: "https://api.mojang.com/profiles/minecraft",
        data: JSON.stringify([args[0]]),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const uuid = resp.data[0].id;
      const username = resp.data[0].name;
      const { data } = await get(key ?? "", uuid);
      const activeProfile = getProfileByName(data.profiles, args[1]);
      if (activeProfile === null) {
        m.edit("That profile does not exist");
      } else {
        const profile = activeProfile.members[uuid];
        profile.banking = activeProfile.bankin;
        await inner(uuid, profile, username, activeProfile.cute_name);
      }
    }
  },
};
