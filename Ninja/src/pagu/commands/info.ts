// ProNinjaGamin0: If this code breaks, it makes sense bc i wrote it
import { Message, Client, MessageEmbed } from "discord.js"

module.exports = {
    name: ["info", "information"],
    category: "Utility",
    description: "Shows information about the bot",
    usage: "info",
    examples: [
       "info"
    ],
    async execute(message:Message, args:Array<string>, client:Client, paguClient:any) {
        let embed:MessageEmbed = new paguClient.Discord.MessageEmbed()
        embed
            .setTitle("Bot Info")
            .setTimestamp()
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        embed.addFields(
            {name:"Uptime", value:`${client.uptime}`, inline:false},
            {name: "Latency", value:`${Date.now() - message.createdTimestamp}ms`, inline: false})
        embed.setFooter(`${Date().toLocaleString()}`)
        embed.setThumbnail(`${client.user?.avatarURL()}`)
        message.channel.send({embeds: [embed]})
    }
}