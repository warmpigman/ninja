import { Client, Message, MessageEmbed } from "discord.js";

import axios from "axios";
import { strictEqual } from "assert";
module.exports = {
  name: ["lowestbin", "lb"],
  description: "Finds the lowest bin of an auction",
  usage: "lowestbin item",
  examples: ["lowestbin diamond", "lowestbin diamond sword"],
  async execute(
    message: Message,
    args: Array<string>,
    client: Client,
    paguClient: any
  ) {
    if (args.length < 1) {
      return message.reply("Please provide an item to search for!");
    }
    let m = await message.reply({
      content: "<a:loading:925859228374142977> Loading...",
      allowedMentions: { repliedUser: false },
    });
    axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response.status === 404) {
          m.edit("Could not find any auctions for that item!");
        }
        await paguClient.Util.cacheThis(
          {
            key: `http://maro-api:3000/api/auctions/find/${args.join(" ")}`,
            data: err.response,
          },
          paguClient
        );
        return err.response;
      }
    );
    let response = await paguClient.Util.cacheGet(
      `http://maro-api:3000/api/auctions/find/${args.join(" ")}`,
      paguClient
    );
    if (!response) {
      response = await axios.get(
        `http://maro-api:3000/api/auctions/find/${args.join(" ")}`
      );
    }
    if (response.status === 404) {
      return m.edit("Could not find any auctions for that item!");
    }
    const args2 = args.join(" ").toLowerCase().split(" ");
    if (!args2.includes("skin")) {
      response.data.auctions.reverse();
    }
    if (
      [
        "red",
        "blue",
        "green",
        "yellow",
        "white",
        "black",
        "purple",
        "gray",
        "orange",
      ].some((x) => args2.includes(x))
    ) {
      response.data.auctions.filter((item: any) =>
        [
          "red",
          "blue",
          "green",
          "yellow",
          "white",
          "black",
          "purple",
          "gray",
          "orange",
        ].some((l) => item.name.includes(l))
      );
    }
    var lbin = response.data.auctions[0];
    var colors = {
      COMMON: "#FFFFFF",
      UNCOMMON: "#00FF00",
      RARE: "#0000FF",
      EPIC: "#800080",
      LEGENDARY: "#FFA500",
      MYTHIC: "#FF0000",
      SPECIAL: "#e391d8",
    };
    let res = await paguClient.Util.cacheGet(
      "https://api.hypixel.net/resources/skyblock/items",
      paguClient
    );
    if (!res) {
      res = await axios.get("https://api.hypixel.net/resources/skyblock/items");
    }
    let seller = await paguClient.Util.cacheGet(
      `https://api.mojang.com/user/profiles/${lbin.rawItem.auction.seller}/names`,
      paguClient
    );
    if (!seller) {
      seller = await axios.get(
        `https://api.mojang.com/user/profiles/${lbin.rawItem.auction.seller}/names`
      );
    }
    seller = seller.data[0].name;
    let tier;
    const item = res.data.items.find((x: any) => x.id == lbin.id);
    if(!item) {
      if(!Object.keys(colors).some((x:any) => {
        if(lbin.id.includes(x)) {
          tier = x;
          return true;
        }
      })) tier="COMMON"
    } else tier=item.tier
    //@ts-expect-error
    let color = colors[tier] || colors.COMMON;

    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Lowest bin of ${lbin.name}`)
      .setThumbnail(`https://sky.shiiyu.moe/item/${lbin.id}`)
      .setFooter(
        `Requested by ${message.author.username}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .addFields([
        {
          name: "Price",
          value: `${Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1
            }).format(lbin.lowestBin)}`,
          inline: true,
        },
        {
          name: "Rarity",
          value: tier.charAt(0).toUpperCase()+tier.slice(1).toLowerCase() || "Common",
          inline: true,
        },
        {
          name: "Seller",
          value: seller,
          inline: true,
        }
      ])
    m.edit({ content: null, embeds: [embed] });
  },
};
