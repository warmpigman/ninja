module.exports = {
    name: ["setmainloggingchannel", "set-main-logging-channel","set-mainloggingchannel"],
    category: "Mod",
    description: "Set's the guild's main logging channel to send logs to.",
    usage: "setmainloggingchannel [ID or #channel]",
    examples: [
        "setmainloggingchannel #bot-logs",
        "setmainloggingchannel 212148329245020082",
    ],
    permissions: ["MANAGE_CHANNELS"],
    hidden: ["mod"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        if(await paguClient.Util.resolveChannel(args, message, 0) == "none") {
            return message.reply(`You must specify a valid channel to add.`)
        }
        var channelID = await paguClient.Util.resolveChannel(args, message, 0)
        const guildSchema = await paguClient.schemas.get('guild')
        guildSchema.findOne({
            guildID: message.guild.id
        }, (err: Error, data: any) => {
            if(err) {
                console.log(err)
                return message.reply({ content: `An error has occured, please try again later.` })
            } else {
                if(!data) {
                    guildSchema.create({
                        guildID: message.guild.id,
                        mainLoggingChannel: {
                            ID:channelID,
                            Set:true
                        }
                    })
                    return message.reply({ content: `<#${channelID}> has been set as the main logging channel.` })
                } else if(data) {
                    if(data.mainLoggingChannel == channelID) {
                        return message.reply({ content: `<#${channelID}> is already the main logging channel.` })
                    } else {
                        data.mainLoggingChannel.ID = channelID
                        data.mainLoggingChannel.Set = true
                        data.save()
                        return message.reply({ content: `<#${channelID}> has been set as the main logging channel.` })
                    }
                }
            }
        })
    }}