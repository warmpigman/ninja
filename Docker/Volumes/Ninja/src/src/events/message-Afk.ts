import { Message, User } from "discord.js"

module.exports = {
    event: 'messageCreate',
    async execute(client: any, paguClient: any, message: Message) {
        var userSchema = await paguClient.schemas.get('user')
        await userSchema.findOne({
            discordID: message.author.id
        }, async (err: Error, data: any) => {
            if (err) throw err;
            else {
                // && data.afk.afk so that useless updates don't happen
                if (data && data.afk.afk) {
                    await userSchema.findOneAndUpdate({
                        discordID: message.author.id
                    }, {
                        afk: {
                            reason: "Not Afk",
                            afk: false
                        }
                    })
                    var embed = await new paguClient.Discord.MessageEmbed()
                        .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
                        .setTimestamp()
                        .addFields({
                            name: `Welcome Back`,
                            value: `You are no longer afk!`
                        })
                    message.channel.send({ embeds: [embed], allowedMentions: { "users": [] } });
                }
            }
        }).clone()
        message.mentions.users.forEach(async (user: User) => {
            await userSchema.findOne({
                discordID: user.id
            }, async (err: Error, data: any) => {
                if (err) throw err;
                else {
                    if (data) {
                        if (data.afk.afk) {
                            var embed = new paguClient.Discord.MessageEmbed()
                                .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
                                .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
                                .setTimestamp()
                                .setTitle('Afk')
                            embed.addFields({
                                name: `${user.tag} is afk!`,
                                value: `Reason: ${data.afk.reason}`
                            })
                            message.channel.send({ embeds: [embed], allowedMentions: { "users": [] } });
                        }
                    }
                }
            }).clone()
        })
    }
}