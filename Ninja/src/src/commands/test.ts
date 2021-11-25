module.exports = {
    name: ["hello-world"],
    category: "Dev",
    description: "Hello-world",
    usage: "eval [code]",
    examples: [
        "hello-world"
    ],
    hidden: ["dev"],
    execute(message: any, args:Array<string>, client:any, paguClient:any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setTimestamp()
        message.channel.send({content: 'hi'})
        
    }
}