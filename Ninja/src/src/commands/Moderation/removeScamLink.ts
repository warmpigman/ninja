module.exports = {
    name: ["remove-scam-link","removescamlink"],
    category: "Mod",
    description: "Remove a scam link to the filter.",
    usage: "removescamlink [website]",
    examples: [
        "removescamlink google.com"
    ],
    permissions: ["MANAGE_MESSAGES"],
    hidden: ["mod"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setTimestamp()
            .setTitle('Removing Scam Link')
        var scamSchema = await paguClient.schemas.get('scam')
        var validWebsites = 0
        if(args.length < 1) {
            embed.setDescription('Please provide a website to remove.')
            return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
        } else {
            for(let index = 0; index < args.length; index++) {
                let website = args[index]
                if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+").test(website)){
                    await scamSchema.findOne({
                        website: website
                    }, async (err: Error, data: any) => {
                        if(err) {
                            await embed.addFields({
                                name: "Error",
                                value: `An error occured, please try again for ${website.toString()}.`
                            })
                            console.log(err)
                        } else if(data) {
                            await data.remove()
                            try {
                                await embed.addFields({
                                    name: "Success",
                                    value: `${website.toString()} has been removed.`
                                })
                            } catch(err) {
                                console.log(err)
                                await embed.addFields({
                                    name: "Error",
                                    value: `An error occurred, try again`
                                })
                            }
                           
                        } else if(!data) {
                            await embed.addFields({
                                name: "Error",
                                value: `${website.toString()} does not exist.`
                            })
                        }
                        if(index == args.length - 1) {
                            return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                        }
                    }).clone()
                } else {
                    await embed.addFields({
                        name: "Error",
                        value: `${website.toString()} is not a valid website.`
                    })
                    if(index == args.length - 1) {
                        return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                    }
                }
                
            }
        }
        
    }
}