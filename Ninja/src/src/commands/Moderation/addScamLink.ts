module.exports = {
    name: ["add-scam-link","addscamlink"],
    category: "Mod",
    description: "Add a scam link to the filter.",
    usage: "addscamlink [website]",
    examples: [
        "addscamlink google.com"
    ],
    permissions: ["MANAGE_MESSAGES"],
    hidden: ["mod"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setTimestamp()
            .setTitle('Adding Scam Link')
        var scamSchema = await paguClient.schemas.get('scam')
        var validWebsites = 0
        if(args.length < 1) {
            embed.setDescription('Please provide a website to add.')
            return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
        } else {
            for(let index = 0; index < args.length; index++) {
                let website = args[index]
                if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+").test(website)){
                    // await addScamLinkFilter(website.toString())
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
                            await embed.addFields({
                                name: "Error",
                                value: `${website.toString()} scam link already exists.`
                            })
                        } else if(!data) {
                            data = await new scamSchema({
                                website: website
                            }).save()
                            await embed.addFields({
                                name: "Success",
                                value: `${website.toString()} has been added.`
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