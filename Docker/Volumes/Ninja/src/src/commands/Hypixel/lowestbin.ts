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
    // const key = process.env.API_KEY;
    // if (args.length == 0) {
    //   return message.reply("Please specify an item!");
    // }
    // let m = await message.reply({
    //   content: "<a:loading:925859228374142977> Loading...",
    //   allowedMentions: { repliedUser: false },
    // });
    // async function run(item: any, key?:string) {
    //   if(key) {
    //     await paguClient.Util.cacheThis({key:key, data: item}, paguClient)
    //   }
    //   var url = `http://maro-api:3000/api/auctions/quickStats/${item.id}`;
    //   var response = await paguClient.Util.cacheGet(url, paguClient);
    //   if (!response) {
    //     axios.interceptors.response.use(
    //       (res: any) => res,
    //       (err: any) => {
    //         if (err.response.status == 404) {
    //           m.edit(`No item found for ${item.name}`);
    //           paguClient.Util.cacheThis(
    //             { key: url, data: err.response },
    //             paguClient
    //           );
    //           return null;
    //         }
    //       }
    //     );
    //     response = await axios.get(url);
    //     if (!response) return;
    //   }
    //   if (response.status == 404) {
    //     return m.edit(`No item found for ${item.name}`);
    //   }
    //   var colors = {
    //     "COMMON": "#FFFFFF",
    //     "UNCOMMON": "#00FF00",
    //     "RARE": "#0000FF",
    //     "EPIC": "#FF0000",
    //     "LEGENDARY": "#FFA500",
    //   }
    //   console.log(item)
    //   const embed = new paguClient.Discord.MessageEmbed()
    //     .setTitle(`${item.tier??"COMMON"} - ${item.name}`)
    //     //@ts-ignore
    //     .setColor(colors[item.tier??'COMMON'])
    //     .setTimestamp()
    //     .setFooter(
    //       `Requested by ${message.author.username}`,
    //       message.author.displayAvatarURL({ dynamic: true })
    //     )
    //     .setThumbnail(`https://sky.shiiyu.moe/item/${item.id}`)
    //     .addFields([
    //       {
    //         name: "Lowest Bin",
    //         value: `${Intl.NumberFormat('en-US',{notation: "compact", maximumFractionDigits:1}).format(response.data.data.min)}`,
    //       },
    //     ]);
    //   m.edit({content: null, embeds: [embed] });
    // }
    // let search_term = args.join(" ").toLowerCase();
    // let { data } = await axios.get(
    //   "https://api.hypixel.net/resources/skyblock/items"
    // );
    // let items = data.items;
    // if (!items) {
    //   return message.reply("Something went wrong, please try again later.");
    // }
    // var matches = new Array();
    // const stringSimilarity = (a: any, b: any) => {
    //   const bg1 = bigrams(a);
    //   const bg2 = bigrams(b);
    //   const c1 = count(bg1);
    //   const c2 = count(bg2);
    //   const combined = uniq([...bg1, ...bg2]).reduce(
    //     // @ts-ignore
    //     (t: any, k: any) => t + Math.min(c1[k] || 0, c2[k] || 0),
    //     0
    //   );
    //   // @ts-ignore
    //   return (2 * combined) / (bg1.length + bg2.length);
    // };
    // const prep = (
    //   str: string // TODO: unicode support?
    // ) =>
    //   str
    //     .toLowerCase()
    //     .replace(/[^\w\s]/g, " ")
    //     .replace(/\s+/g, " ");

    // const bigrams = (str: string) =>
    //   [...str].slice(0, -1).map((c: any, i: any) => c + str[i + 1]);

    // const count = (xs: any[]) =>
    //   xs.reduce((a: any, x: any) => ((a[x] = (a[x] || 0) + 1), a), {});

    // const uniq = (xs: any) => [...new Set(xs)];
    // if(await paguClient.Util.cacheGet(`${search_term.toLowerCase()}`, paguClient)){
    //   return run(await paguClient.Util.cacheGet(`${search_term.toLowerCase()}`, paguClient));
    // }
    // for (var i = 0; i < items.length; i++) {
    //   var likeliness = stringSimilarity(
    //     search_term.toLowerCase(),
    //     items[i].id.toLowerCase()
    //   );
    //   matches.push({ item: items[i], likeliness: likeliness });
    // }
    // if (i == items.length) {
    //   await matches.sort((a: any, b: any) => {
    //     return a.likeliness - b.likeliness;
    //   });

    //   var likeliest = matches[matches.length - 1];
    //   var item = likeliest.item;
    //   if (likeliest.likeliness < 0.5 && item) {
    //     var Matches = new Array();
    //     for (var j = 0; j < items.length; j++) {
    //       var likeliness = stringSimilarity(
    //         search_term.toLowerCase(),
    //         items[j].name.toLowerCase()
    //       );
    //       Matches.push({ item: items[j], likeliness: likeliness });
    //     }
    //     if (j == items.length) {
    //       await Matches.sort((a: any, b: any) => {
    //         return a.likeliness - b.likeliness;
    //       });
    //       likeliest = Matches[Matches.length - 1];
    //       item = likeliest.item;
    //       if (likeliest.likeliness < 0.5) {
    //         return m.edit(`No item found, did you mean: ${item.name}`);
    //       } else {
    //         run(item, search_term);
    //       }
    //     }
    //   } else {
    //     run(item, search_term);
    //   }
    // }
  },
};
