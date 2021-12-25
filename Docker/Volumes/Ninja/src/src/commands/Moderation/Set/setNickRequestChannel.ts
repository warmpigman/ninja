module.exports = {
    name: ["setnickrequestchannel", "set-nick-request-channel","set-nickrequestchannel"],
    category: "Mod",
    description: "Set's the guild's nick request channel to send requests to.",
    usage: "setnickrequestchannel [ID or #channel]",
    examples: [
        "setnickrequestchannel #nick-requests",
        "setnickrequestchannel 212148329245020082",
    ],
    permissions: ["MANAGE_CHANNELS"],
    hidden: ["mod"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        if(await paguClient.Util.resolveChannel(args, message, 0, false) == "none") {
            return message.reply(`You must specify a valid channel to set.`)
        }
        var channelID = await paguClient.Util.resolveChannel(args, message, 0, false)
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
                        nickRequestChannel: {
                            ID:channelID,
                            Set:true
                        }
                    })
                    return message.reply({ content: `<#${channelID}> has been set as the nick request channel.` })
                } else if(data) {
                    if(data.nickRequestChannel == channelID) {
                        return message.reply({ content: `<#${channelID}> is already the nick request channel.` })
                    } else {
                        data.nickRequestChannel.ID = channelID
                        data.nickRequestChannel.Set = true
                        data.save()
                        return message.reply({ content: `<#${channelID}> has been set as the nick request channel.` })
                    }
                }
            }
        })
    }}