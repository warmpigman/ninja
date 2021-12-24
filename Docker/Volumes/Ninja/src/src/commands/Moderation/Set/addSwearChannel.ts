module.exports = {
    name: ["addswearchannel", "add-swear-channel","add-swearchannel"],
    category: "Mod",
    description: "Add's a channel to the swear-allowed channels",
    usage: "addswearchannel [ID or #channel]",
    examples: [
        "addswearchannel #no-filter",
        "addswearchannel 212148329245020082",
    ],
    permissions: ["MANAGE_CHANNELS"],
    hidden: ["mod"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        if(await paguClient.Util.resolveChannel(args, message, 0) == "none") {
            return message.reply(`You must specify a valid channel to add.`)
        }
        var channelID = await paguClient.Util.resolveChannel(args, message, 0)
        const guildSchema = await paguClient.schemas.get('guild')
            await guildSchema.findOne({
                guildID: message.guild.id
            }, async (err: Error, data: any) => {
                if(err) {
                    console.log(err)
                    return message.reply({ content: `An error has occured, please try again later.` })
                } else if(!data) {
                    await guildSchema.create({
                        guildID: message.guild.id,
                        swearAllowedChannels: [channelID]
                    })
                    return message.reply({ content: `<#${channelID}> has been added to the swear allowed channels.` })
                } else if(data) {
                    if(!data.swearAllowedChannels.includes(channelID)) {
                        data.swearAllowedChannels.push(channelID)
                        await data.save()
                        return message.reply({ content: `<#${channelID}> has been added to the swear allowed channels.` })
                    } else {
                        return message.reply({ content: `<#${channelID}> is already a swear allowed channel.` })
                    }
                }
            }).clone()
    }}