import { Message, Client, MessageEmbed } from "discord.js";

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
          "https://nariah-dev.com/api/networth/categories",
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
        for (let i = 0; i < 5; i++) {
          storageText += `${storage.top_items[i].name} → ${abbreviateNumber(
            storage.top_items[i].price
          )}\n`;
          inventoryText += `${inventory.top_items[i].name} → ${abbreviateNumber(
            inventory.top_items[i].price
          )}\n`;
          enderchestText += `${
            enderchest.top_items[i].name
          } → ${abbreviateNumber(enderchest.top_items[i].price)}\n`;
          wardrobeText += `${wardrobe.top_items[i].name} → ${abbreviateNumber(
            wardrobe.top_items[i].price
          )}\n`;
          petsText += `${pets.top_items[i].name} → ${abbreviateNumber(
            pets.top_items[i].price
          )}\n`;
          talismansText += `${talismans.top_items[i].name} → ${abbreviateNumber(
            talismans.top_items[i].price
          )}\n`;
        }
        embed.addFields([
          {
            name: `Storage Value: ${abbreviateNumber(storage.total)}`,
            value: storageText,
          },
          {
            name: `Storage Value: ${abbreviateNumber(inventory.total)}`,
            value: inventoryText,
          },
          {
            name: `Storage Value: ${abbreviateNumber(enderchest.total)}`,
            value: enderchestText,
          },
          {
            name: `Storage Value: ${abbreviateNumber(wardrobe.total)}`,
            value: wardrobeText,
          },
          {
            name: `Storage Value: ${abbreviateNumber(pets.total)}`,
            value: petsText,
          },
          {
            name: `Storage Value: ${abbreviateNumber(talismans.total)}`,
            value: talismansText,
          },
        ]);

        m.edit({
          content: null,
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        });
      } catch (e: any) {
        if (e.response === undefined)
          m.edit({
            content: `There was an error`,
            allowedMentions: { repliedUser: false },
          });
        else if (e.response.data === undefined)
          m.edit({
            content: `There was an error`,
            allowedMentions: { repliedUser: false },
          });
        else if (e.reponse.data.status === undefined)
          m.edit({
            content: `There was an error`,
            allowedMentions: { repliedUser: false },
          });
        else {
          let embed = new MessageEmbed();
          embed.setTitle("Error");
          embed.setColor(
            `#${Math.floor(Math.random() * 16777215).toString(16)}`
          );
          embed.setTimestamp(Date.now());
          embed.setFooter(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          );
          embed.addField(
            e.response.data.status.toString(),
            e.response.data.cause
          );
          m.edit({
            content: null,
            embeds: [embed],
            allowedMentions: { repliedUser: false },
          });
        }
      }
    }

    if (args.length == 0) {
    } else if (args.length == 1) {
      if (false) {
      } else {
        const resp = await axios.get(
          `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
        );
        const uuid = resp.data.id;
        const username = resp.data.name;
        const { data } = await axios.get(
          `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
        );
        const activeProfile = getActiveProfile(data.profiles, uuid);
        const profile = activeProfile.members[uuid];
        profile.banking = activeProfile.banking;
        await inner(uuid, profile, username, activeProfile.cute_name);
      }
    } else if (args.length == 2) {
      const resp = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
      );
      const uuid = resp.data.id;
      const username = resp.data.name;
      const { data } = await axios.get(
        `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
      );
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
