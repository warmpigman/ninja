import { time } from "console";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, Client, MessageEmbed, CommandInteraction, DiscordAPIError, MessageEditOptions, User } from "discord.js";
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
    if (profile.cute_name.toLowerCase() === name.toLowerCase()) {
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

const getEnchants = (str: string) => {
  const regex =
    /(?<![MDCLXVI])(?=[MDCLXVI])M{0,3}(?:C[MD]|D?C{0,3})(?:X[CL]|L?X{0,3})(?:I[XV]|V?I{0,3})[^ ]\b/gm;
  let m;
  var total = new Array();
  var enchants = new Array();
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      total.push(match);
    });
  }
  function filter(string: any) {
    return string
      .replace(/ยง9/g, "")
      .replace(/, /g, "")
      .replace(/ยง/g, "")
      .replace(/\\/g, "");
  }
  total.forEach((item) => {
    var a = str.substring(
      str.indexOf("ยง9"),
      str.indexOf(item) + filter(item).length
    );
    if (filter(a).length == 0) return;
    enchants.push(a);
    str = str.substring(str.indexOf(item));
  });
  enchants.map((item, index) => {
    item = filter(item);
    enchants[index] = item;
  });
  return enchants;
};

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function inner(profile: any, uuid: any, username: String, author:User) {
  const key = process.env.API_KEY;
  let url = `https://api.hypixel.net/skyblock/auction?key=${key}&player=`;
  let response;
  try {
    response = await paguClient.Util.cacheGet(url + uuid, paguClient);
  }
  catch (e:any) {
    response = e.response
  }
  if (!response) {
    response = await axios.get(url + uuid);
    await paguClient.Util.cacheThis(
      {
        key: url + uuid,
        data: response,
      },
      paguClient
    );
  }

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
    embed.setFooter(
      `Profile: ${profile.cute_name}`,
      author.displayAvatarURL({ dynamic: true })
    );
    embed.setTimestamp(Date.now());
    embed.setThumbnail(`https://mc-heads.net/head/${uuid}`);
    embed.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
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
      let name = auction.item_name.includes("Enchanted Book")
        ? `Enchanted Book: ${getEnchants(auction.item_lore)}`
        : auction.item_name;
      if (!auction.claimed) {
        embed.addField(
          name,
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
          name,
          `Current Bid: **${abbreviateNumber(
            auction.highest_bid_amount
          )}** โ€ข Ends in: **${nice_time}**`
        );
      }
    }
    return {
      content: null,
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    }
  }
  let embed = new MessageEmbed
  embed.setColor([247, 51, 37])
  embed.addField("An Error Has Ocurred", response.data.cause)
  return {content:null, embeds:[embed], allowedMentions:{repliedUser:false}}
}
async function getHyCache(uuid:string, paguClient:any) {
  const key = process.env.API_KEY
  let response = await paguClient.Util.cacheGet(
    `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
    paguClient
  );
  if (!response) {
    response = await paguClient.Util.apiCallHandler(
      `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
    );
    console.log(response)
    await paguClient.Util.cacheThis(
      {
        key: `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
        data: response,
      },
      paguClient
    );
    return response
  }
}
module.exports = {
  name: ["auctions", "ah"],
  category: "Hypixel",
  description:
    "Shows the auction house of yourself or a player. You may also choose a specific profile of a player.",
  usage: "ah (user) (profile)",
  slashInit() {
<<<<<<< HEAD:Docker/Volumes/Ninja/src/src/commands/Hypixel/ah.ts
    return new SlashCommandBuilder().setName("auctions").setDescription("Shows the auction house of yourself or a player.")
    .addStringOption(option => option.setName("username").setDescription("The username of the player. Leave blank for yourself."))
    .addStringOption(option => option.setName("profile")
    .setDescription("The profile to check. Leave blank for most recently played")
    .addChoices([["apple", "apple"], ["banana", "banana"], ["blueberry", "blueberry"], ["coconut", "coconut"], ["cucumber", "cucumber"], ["grapes", "grapes"], ["kiwi", "kiwi"], ["lemon", "lemon"], ["lime", "lime"], ["mango", "mango"], ["orange", "orange"], ["papaya", "papaya"], ["pear", "pear"], ["peach", "peach"], ["pineapple", "pineapple"], ["pomegranate", "pomegranate"], ["raspberry", "raspberry"], ["strawberry", "strawberry"], ["tomato", "tomato"], ["watermelon", "watermelon"], ["zucchini", "zucchini"]]))
    
=======
    return new SlashCommandBuilder()
      .setName("auctions")
      .setDescription("no")
      .addStringOption((option) =>
        option.setName("test").setDescription("test2")
      );
>>>>>>> 6f1580f4b0d2c0c550975c668e6ccd41912ff649:Docker/Volumes/Ninja/src/src/commands/test.ts
  },
  examples: [
    "ah",
    "auctions",
    "ah ProNinjaGamin0",
    "auctions Warmpigman",
    "ah Apple",
    "ah ProNinjaGamin0 Apple",
  ],
  async messageExecute(
    message: Message,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    const key = process.env.API_KEY;
    
    let m = await message.reply({
      content: "<a:loading:925859228374142977> Loading...",
      allowedMentions: { repliedUser: false },
    });

    

    if (args.length == 0) {
      const userSchema = paguClient.schemas.get("user");
      userSchema.findOne(
        { discordID: message.author.id },
        async (err: Error, data: { mojangUUID: string }) => {
          if (!data) {
            m.edit("You need to link your account first!");
            return;
          }
          let uuid = data.mojangUUID;
          let response = await getHyCache(uuid, paguClient)
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
                let messageOptions = await inner(profile, uuid, response.data.slice(-1)[0].name, message.author);
                m.edit(messageOptions)
              } catch (e) {
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
      ];
      if (possible.includes(args[0])) {
        const userSchema = paguClient.schemas.get("user");
        userSchema.findOne(
          { discordID: message.author.id },
          async (err: Error, data: { mojangUUID: String }) => {
            if (!data) {
              m.edit("You need to link your account first!");
              return;
            }
            let uuid = data.mojangUUID;
            let response = await paguClient.Util.cacheGet(
              `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
              paguClient
            );
            if (!response) {
              response = await paguClient.Util.apiCallHandler(
                `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
              );
              await paguClient.Util.cacheThis(
                {
                  key: `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
                  data: response,
                },
                paguClient
              );
            }
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
                    let messageOptions = await inner(profile, uuid, response.data.slice(-1)[0].name, message.author);
                    m.edit(messageOptions)
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
          let response = await paguClient.Util.cacheGet(
            `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
            paguClient
          );
          if (!response) {
            response = await paguClient.Util.apiCallHandler(
              `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
            );
            await paguClient.Util.cacheThis(
              {
                key: `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
                data: response,
              },
              paguClient
            );
          }
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
              let messageOptions = await inner(profile, uuid, username, message.author);
              m.edit(messageOptions)
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
        let response = await paguClient.Util.cacheGet(
          `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
          paguClient
        );
        if (!response) {
          response = await paguClient.Util.apiCallHandler(
            `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`
          );
          await paguClient.Util.cacheThis(
            {
              key: `https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`,
              data: response,
            },
            paguClient
          );
        }
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
              let messageOptions = await inner(profile, uuid, username, message.author);
              m.edit(messageOptions)
            }
        }
      }
    }
  },
<<<<<<< HEAD:Docker/Volumes/Ninja/src/src/commands/Hypixel/ah.ts
  async slashExecute(interaction: CommandInteraction, client: any, paguClient: any): Promise<undefined> {
    if (!interaction.isCommand()) return;
    await interaction.deferReply()
    console.log(typeof paguClient)
    let username;
    let uuid;
    if (interaction.options.getString("username") === null) {
      const userSchema = paguClient.schemas.get("user");
      let found = false
      userSchema.findOne(
        { discordID: interaction.user.id },
        async (err: Error, data: { mojangUUID: String }) => {
          if (!data) {
            interaction.deleteReply()
            interaction.followUp({content:"You need to link your account first", ephemeral:true})
            return
          }
          uuid = data.mojangUUID
          found = true
      })
      if (!found) return
      try {
      let response = await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`)
      console.log(response.status)
      username = response.data.slice(-1)[0].name
      }
      catch (e:any) {
        console.log(e)
        interaction.deleteReply()
        interaction.followUp({content:"That player does not exist.", ephemeral:true})
        return
      }
    }
    else {
      username = interaction.options.getString("username")
      try {
        let response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        let data = response.data
        username = data.name
        uuid = data.id
      }
      catch (e:any) {
        console.log(e)
        interaction.deleteReply()
        interaction.followUp({content:"That player does not exist", ephemeral:true})
        return
      }
    }
    
    let profile;
    let response = await getHyCache(uuid, paguClient)
    if (interaction.options.getString("profile") == null) {
      profile = getActiveProfile(response.data.profiles, uuid)
    }
    else {
      let found = false
      let profiles: Array<any>= response.data.profiles
      profiles.forEach((p:any) => {
        if (p.cute_name == interaction.options.getString("profile")) {
          profile = p
          found = true
          return
        }
      })
      if (!found) {
        interaction.deleteReply()
        interaction.followUp({content:"That profile does not exist", ephemeral:true})
        return
      }
    }
    let messageOptions = await inner(profile, uuid, username, interaction.user) 
    interaction.editReply(messageOptions)
    
=======
  async slashExecute(
    interaction: CommandInteraction,
    client: any,
    paguClient: any
  ) {
    // if (!interaction.isCommand()) return;
    console.log(interaction.options.getString("test"));
>>>>>>> 6f1580f4b0d2c0c550975c668e6ccd41912ff649:Docker/Volumes/Ninja/src/src/commands/test.ts
  },
};
