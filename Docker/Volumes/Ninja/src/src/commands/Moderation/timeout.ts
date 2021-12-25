import { Message, Guild, Client, TextChannel, MessageEmbed } from "discord.js"

module.exports = {
    name: ["timeout"],
    category: "Mod",
    description: "Times out a user. Valid time multipliers are seconds (s), minutes (m), hours (h), and days (d).",
    usage: "timeout [user] [duration] (reason)",
    examples: [
        "timeout <@300669365563424770> 30",
        "timeout 300669365563424770 10m",
        "timeout 300669365563424770 3d broke da rules",
    ],
    async execute(message: Message, args: Array<string>, client: Client, paguClient: any) {
        if (args.length == 0) {
            message.channel.send(`Please follow the proper usage of ${module.exports.usage}`)
        }
        else if (args.length == 1) {
            message.channel.send("Please specify a duration to timeout the user.")
        }
        else {
            let member_id = (isNaN(parseInt(args[0]))) ? args[0].slice(3, -1) : args[0]
            interface Multipliers {
                [key: string]: number
            }
            const multipliers:Multipliers = {s:1, m:60, h:3600, d:86400}
            // First time
            // let duration = (isNaN(parseInt(args[1]))) ? ((isNaN(parseInt(args[1].slice(0, -1)))) ? 0 : (parseInt(args[1].slice(0, -1)) * multipliers[args[1].slice(-1)])) : parseInt(args[1])
            
            // Second time using stricter regex instead of parseInt
            // Actually this is the fourth time i didnt save the ones before
            let duration = (args[1].match(/^\d+$/) == null) ? ((isNaN(parseInt(args[1].slice(0, -1)))) ? 0 : ((Object.keys(multipliers).includes(args[1].slice(-1)))) ? multipliers[args[1].slice(-1)] : 0) : parseInt(args[1])
            console.log(duration)

            if (duration === 0 || isNaN(duration)) {
                message.channel.send("Please use a proper duration")
            }
            else {
                let reason = (args.length >= 3) ? args.slice(2).toString() : "None"
                if (message.guildId === null) {
                    message.channel.send("This must be used in a guild")
                }
                else {
                    let guild = client.guilds.cache.get(message.guildId)
                    let member = guild?.members.cache.get(member_id)

                    let epoch_timestamp = (Date.now()) + (duration * 1000)
                    let timestamp = new Date(epoch_timestamp)
                    let options = {"communicationDisabledUntil":timestamp.toISOString()}
                    member?.edit(options, reason).then((res:any) => {
                        let guildSchema = paguClient.schemas.get("guild")
                        guildSchema.findOne({guildID:message.guildId}, async (err:Error, data:{mainLoggingChannel:string}) => {
                            let mainLoggingChannel = data.mainLoggingChannel
                            const channel: TextChannel = await client.channels.fetch(mainLoggingChannel) as TextChannel
                            let embed = new MessageEmbed
                            embed.setAuthor({name:`${member?.user.username}`, iconURL:`${member?.user.avatarURL()}`})
                            embed.setTitle("Timed Out User")
                            embed.addFields([{name: "User Timed Out", value:`<@${member?.id}>`},
                            {name:"Moderator", value:`<@${message.author.id}>`}])
                            embed.setTimestamp(Date.now())
                            channel.send({embeds:[embed]})
                        })
                    })

                    
                }
            }
        }
    }
}