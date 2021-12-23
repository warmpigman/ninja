module.exports = {
    name: ["ping", "latency"],
    category: "Utility",
    description: "Shows the bot latency.",
    usage: "ping",
    examples: [
    "ping"   
    ],
    execute(message: any, args: Array<string>, client: any, paguClient: any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' +client.user.username, message.author.displayAvatarURL({ dynamic: true }))
           .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setTimestamp()
            .setTitle(`${client.user.username} Ping`)
            .addFields(
                {name: "Latency", value:`${Date.now() - message.createdTimestamp}ms`, inline: true},
                {name: "Api Latency", value:`${Math.round(client.ws.ping)}ms`, inline: true}
            );
            message.channel.send({embeds: [embed]})

    }
}