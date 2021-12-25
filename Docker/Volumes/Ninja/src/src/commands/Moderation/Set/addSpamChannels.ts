module.exports = {
    name: ["addspamchannel", "add-spam-channel","add-spamchannel"],
    category: "Mod",
    description: "Add's a channel to the spam-allowed channels. Categories are also supported!",
    usage: "addspamchannel [ID or #channel]",
    examples: [
        "addspamchannel #no-filter",
        "addspamchannel 212148329245020082",
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
                        [message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"spamAllowedCategories":"spamAllowedChannels"]: [channelID]
                    })
                    return message.reply({ content: `<#${channelID}> has been added to the spam allowed ${message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"categories":"channels"}.` })
                } else if(data) {
                    if(!data[message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"spamAllowedCategories":"spamAllowedChannels"].includes(channelID)) {
                        data[message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"spamAllowedCategories":"spamAllowedChannels"].push(channelID)
                        await data.save()
                        return message.reply({ content: `<#${channelID}> has been added to the spam allowed ${message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"categories":"channels"}.` })
                    } else {
                        return message.reply({ content: `<#${channelID}> is already a spam allowed ${message.guild.channels.cache.get(channelID).type=="GUILD_CATEGORY"?"categories":"channels"}.` })
                    }
                }
            }).clone()
    }}