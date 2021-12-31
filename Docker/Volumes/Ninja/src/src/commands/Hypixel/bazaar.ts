import axios from "axios";
import {Client, Message, MessageEmbed } from "discord.js"

function abbreviateNumber(value: any) {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
}

module.exports = {
    name: ["bz", "bazaar"],
    category: "Hypixel",
    description:
      "Shows the bazaar stats of an item.",
    usage: "bz [item]",
    examples: [
      "bz enchanted diamond",
      "bazaar enchanted oak"
    ],
    async execute(
        message: Message,
        args: Array<string>,
        client: Client,
        paguClient: any
    ) {
        const key = process.env.API_KEY
        if (args.length == 0) {
            message.channel.send("You must specify an item to look for.")
        }
        else {
            let m = await message.reply({
                content: "<a:loading:925859228374142977> Loading...",
                allowedMentions: { repliedUser: false },
            });
            let search_term = args.join(" ").toLowerCase()
            const response = await axios.get(`https://sky.shiiyu.moe/api/v2/bazaar?key=${key}`);
            let items = response.data
            let found = false
            for (const property in items) {
                if (items[property].name.toLowerCase() == search_term) {
                    found = true
                    let item = items[property]
                    let embed = new MessageEmbed
                    embed.setTitle(`Bazaar Data for ${item.name}`)
                    embed.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
                    embed.setTimestamp(Date.now());
                    embed.setFooter(
                        `Requested by ${message.author.username}`,
                        message.author.displayAvatarURL({ dynamic: true })
                    );
                    embed.setThumbnail(`https://sky.shiiyu.moe/item/${item.id}`)
                    embed.addFields([
                        {name:`Item Name`, value:`${item.name}`, inline:true},
                        {name:`Instant Buy`, value:`${item.buyPrice.toFixed(2)}`, inline:true},
                        {name:`Buy Volume`, value:`${abbreviateNumber(item.buyVolume)}`, inline:true},
                        {name:`Price`, value:`${item.price.toFixed(2)}`, inline:true},
                        {name:`Instant Sell`, value:`${item.sellPrice.toFixed(2)}`, inline:true},
                        {name:`Sell Volume`, value:`${abbreviateNumber(item.sellVolume)}`, inline:true},

                    ])
                    m.edit({content:null, embeds:[embed], allowedMentions:{repliedUser:false}})
                }
            }
            if (!found) {
                m.edit({content:`Could not find ${search_term}`, allowedMentions:{repliedUser:false, roles:[], users:[], parse:[]}})
            }
        }
      
    }
}