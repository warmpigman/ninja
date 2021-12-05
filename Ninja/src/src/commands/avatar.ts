// ProNinjaGamin0: I also wrote this, but u can blame warm for this one bc they were offline when i wrote it
import {Message, Client, MessageEmbed, User} from "discord.js"
module.exports = {
    name: ["avatar", "av"],
    category: "Image",
    description: "Shows your own or the specified user's avatar.",
    usage: "avatar (user mention/id)",
    examples: [
        "avatar", 
        "avatar @ProNinjaGamin0",
        "avatar 300669365563424770",
        "avatar @warmpigman"
    ],
    async execute(message:Message, args:Array<string>, client:Client, paguClient:any) {
        if (args.length === 0) {
            let embed = new MessageEmbed()
            embed.setImage(String(message.author.avatarURL()))
            embed.setTimestamp()
            embed.setFooter(`${message.author.toString()} | ${client.user?.username} `, message.author.avatarURL()?.toString())
            message.channel.send({embeds: [embed]})
            return
        }
        let user_str:string = args[0]
        let user_id:Number = parseInt(user_str)
        let user = paguClient.users.fetch(user_id)
        user.then((user:User) => {
            let embed = new MessageEmbed
            embed.setImage(String(user.displayAvatarURL()))
            embed.setTimestamp()
            embed.setFooter(`${message.author.username} | ${client.user?.username} `, message.author.avatarURL()?.toString())
            message.channel.send({embeds: [embed]})
            return
        }).catch(() => {
            message.channel.send("Could not find that user.")
        });

    }
}