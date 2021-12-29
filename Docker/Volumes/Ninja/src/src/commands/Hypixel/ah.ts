import { time } from "console";
import { Message, Client, MessageEmbed } from "discord.js";
import { listenerCount } from "process";
const axios = require("axios");
const getActiveProfile = function (profiles: any, uuid: any) {
  return profiles.sort(
    (a: any, b: any) => b.members[uuid].last_save - a.members[uuid].last_save
  )[0];
};
const getProfileByName = function (profiles: any, name: String) {
  let profile: any;
  for (profile in profiles) {
    if (profile.cute_name === name) {
      return profile;
    }
  }
  return null;
};

const divmod = (x: any, y: any) => [Math.floor(x / y), x % y];

function abbreviateNumber(value: any) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

module.exports = {
  name: ["ah", "auctions"],
  category: "Hypixel",
  description:
    "Shows the auction house of yourself or a player. You may also choose a specific profile of a player.",
  usage: "ah (user) (profile)",
  examples: [
    "ah",
    "auctions",
    "ah ProNinjaGamin0",
    "auctions Warmpigman",
    "ah Apple",
    "ah ProNinjaGamin0 Apple",
  ],
  async execute(
    message: Message,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    const key = process.env.API_KEY;
    let url = `https://api.hypixel.net/skyblock/auction?key=${key}&player=`;
    let m = await message.reply({
      content: "<a:loading:925859228374142977> Loading...",
      allowedMentions: { repliedUser: false },
    });

    async function inner(profile: any, uuid: any, username: String) {
      let response = await axios.get(url + uuid);

      if (response.status == 200) {
        let auctions: any[] = [];
        let totalUnclaimed = 0;
        for (let auction of response.data.auctions) {
          if (
            auction.profile_id == profile.profile_id &&
            (auction.end > Date.now() + 300 * 1000 || !auction.claimed)
          ) {
            auctions.push(auction);
          }
          if (auction.end < Date.now() + 300 * 1000 && !auction.claimed) {
            totalUnclaimed += auction.highest_bid_amount;
          }
        }
        let embed = new MessageEmbed();
        embed.setTitle("Auctions");
        embed.setFooter(`Profile: ${profile.cute_name}`);
        embed.setTimestamp(Date.now());
        embed.setThumbnail(`https://mc-heads.net/head/${uuid}`);
        let d =
          totalUnclaimed > 0
            ? `**[${username}](https://sky.shiiyu.moe/stats/${username}/${
                profile.cute_name
              }) has ${abbreviateNumber(
                totalUnclaimed
              )} coins that are unclaimed**`
            : `[${username}](https://sky.shiiyu.moe/stats/${username}/${profile.cute_name})`;
        embed.setDescription(d);
        for (let auction of auctions) {
          if (!auction.claimed) {
            embed.addField(
              auction.item_name,
              `This auction has **ended at ${abbreviateNumber(
                auction.highest_bid_amount
              )}** coins`
            );
          } else {
            let timeleft: Number = auction.end - Date.now();
            let a = divmod(timeleft, 3600);
            let hours = a[0];
            let remainder = a[1];
            let b = divmod(remainder, 60);
            let minutes = b[0];
            let seconds = b[1];
            let nice_time =
              hours > 0 ? `${hours}h, ${minutes}m` : `${minutes}m`;
            embed.addField(
              auction.item_name,
              `Current Bid: **${abbreviateNumber(
                auction.highest_bid_amount
              )}** • Ends in: **${nice_time}**`
            );
          }
        }
        m.edit({
          content: null,
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        });
      }
    }

    if (args.length == 0) {
      const userSchema = paguClient.schemas.get("user");
      userSchema.findOne(
        { discordID: message.author.id },
        async (err: Error, data: { mojangUUID: String }) => {
          let uuid = data.mojangUUID;
          let response = await paguClient.Util.apiCallHandler(
            `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
          );
          switch (response.status) {
            case 404:
              m.edit("Could not find that user or profile.");
              return;
            case 500:
              m.edit(
                "There was an error getting the data. Please try again later."
              );
              return;
            case 502:
              m.edit(
                "Hypixel's API is experiencing some technical issues. Please try again later."
              );
              return;
            case 503:
              m.edit(
                "Hypixel's API is in maintenance. Please try again later."
              );
              return;
            case 200:
              let profiles = response.data.profiles;
              let profile = getActiveProfile(profiles, uuid);
              try {
                response = await axios.get(
                  `https://api.mojang.com/user/profiles/${uuid}/names`
                );
                await inner(profile, uuid, response.data[0].name);
              } catch {
                m.edit("There was an issue in finding the player");
              }
          }
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
        const userSchema = paguClient.schemas.get("user");
        userSchema.findOne(
          { discordID: message.author.id },
          async (err: Error, data: { mojangUUID: String }) => {
            let uuid = data.mojangUUID;
            let response = await paguClient.Util.apiCallHandler(
              `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
            );
            switch (response.status) {
              case 404:
                m.edit("Could not find that user or profile.");
                return;
              case 500:
                m.edit(
                  "There was an error getting the data. Please try again later."
                );
                return;
              case 502:
                m.edit(
                  "Hypixel's API is experiencing some technical issues. Please try again later."
                );
                return;
              case 503:
                m.edit(
                  "Hypixel's API is in maintenance. Please try again later."
                );
                return;
              case 200:
                let profiles = response.data.profiles;
                let profile = getProfileByName(profiles, args[0]);
                if (profile === null) {
                  m.edit("That is not a valid profile");
                } else {
                  try {
                    response = await axios.get(
                      `https://api.mojang.com/user/profiles/${uuid}/names`
                    );
                    await inner(profile, uuid, response.data[0].name);
                  } catch {
                    m.edit("There was an issue in finding the player");
                  }
                }
            }
          }
        );
      } else {
        let r = await axios.get(
          `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
        );
        let username = r.data.name;
        if (r.status == 200) {
          let uuid = r.data.id;
          let response = await paguClient.Util.apiCallHandler(
            `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
          );
          switch (response.status) {
            case 404:
              m.edit("Could not find that user or profile.");
              return;
            case 500:
              m.edit(
                "There was an error getting the data. Please try again later."
              );
              return;
            case 502:
              m.edit(
                "Hypixel's API is experiencing some technical issues. Please try again later."
              );
              return;
            case 503:
              m.edit(
                "Hypixel's API is in maintenance. Please try again later."
              );
              return;
            case 422:
              m.edit("There was an issue getting the profiles.");
              return;
            case 200:
              let profiles = response.data.profiles;
              let profile = getActiveProfile(profiles, uuid);
              await inner(profile, uuid, username);
          }
        } else if (r.status == 404) {
          m.edit("That player does not exist");
        } else {
          m.edit("There was an error getting the player.");
        }
      }
    } else if (args.length == 2) {
      let r = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
      );
      let username = r.data.name;
      if (r.status == 200) {
        let uuid = r.data.id;
        let response = await paguClient.Util.apiCallHandler(
          `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
        );
        switch (response.status) {
          case 404:
            m.edit("Could not find that user or profile.");
            return;
          case 500:
            m.edit(
              "There was an error getting the data. Please try again later."
            );
            return;
          case 502:
            m.edit(
              "Hypixel's API is experiencing some technical issues. Please try again later."
            );
            return;
          case 503:
            m.edit("Hypixel's API is in maintenance. Please try again later.");
            return;
          case 422:
            m.edit("There was an issue getting the profiles.");
            return;
          case 200:
            let profile = getProfileByName(response.data.profiles, args[2]);
            if (profile === null) {
              m.edit("That is not a valid profile");
            } else {
              await inner(profile, uuid, username);
            }
        }
      }
    }
  },
};
