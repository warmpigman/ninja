import { Message } from "discord.js"

module.exports = {
    event: 'messageCreate',
    async execute(client:any, paguClient:any, message: Message) {
        // console.log(message?.member?.permissions?.has('268443648'))
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setTimestamp()
            .setTitle('Scam Message')
        var scamSchema = await paguClient.schemas.get('scam')
        var scamData = await scamSchema.find().clone().exec()
        if(new RegExp(scamData.map((data: any) => data.website).join('|')).test(message.content)) {
            message.delete()
            embed.setDescription(`${message.author.tag} has sent a scam message.`)
            message.channel.send({embeds:[embed]})
        }
    }
}