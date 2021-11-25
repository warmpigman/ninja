import { MessageMentions, MessageAttachment, MessageReaction, User, Message } from 'discord.js';
import * as hastebin from 'hastebin'
module.exports = {
    name: ["purge", "clear", "prune"],
    category: "Mod",
    description: "Purges a certain amount of message with optional filters! ( Filters are used by -<filter>, possible filters are bots, users, links, invites, embeds, images, files, mentions, pins, silent)",
    usage: "purge <amount> [Filters]",
    examples: [
        "purge 100 -invites"
    ],
    hidden: ["mod"],
    async execute(message: any, args: Array<string>, client: any, paguClient: any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTimestamp()
            .setTitle('Purge')
        var tags = ['bots', 'users', 'links', 'invites', 'embeds', 'images', 'files', 'mentions', 'pins', 'silent']
        var { channel } = message
        if (args.length == 0) {
            embed.setDescription('Purge is used to delete messages from a channel!\n\nUsage: `purge <amount> [Filters]`\n\nFilters are used by `-<filter>`, possible filters are: \n\n' + tags.join(', '))
            return message.reply({ embeds: [embed], allowedMentions: { users: [] } })
        }
        var limit = Number(args[0])
        if (isNaN(limit) || !Number.isInteger(limit)) {
            embed.setDescription('Please enter a valid number!')
            return message.reply({ embeds: [embed], allowedMentions: { users: [] } })
        }
        if (!limit || limit < 2 || limit > 1000) {
            embed.setDescription('Please enter a number between 2 and 1000!')
            return message.reply({ embeds: [embed], allowedMentions: { users: [] } })
        }
        var filter = new Array()
        if (args.filter((arg: any) => !MessageMentions.USERS_PATTERN.test(arg)).length > 1) {
            var filteredArgs = args.slice(1).filter((arg: any) => !MessageMentions.USERS_PATTERN.test(arg))
            filteredArgs.forEach((filtered: any) => {
                if (tags.includes(filtered.toString().substring(1)) && filtered.toString().startsWith('-')) filter.push(filtered.toString().substring(1))
            })
        }

        var messagesToDelete = new Array()
        var splitLimit = limit
        var counter = 0
        function findNextLimit() {
            if (splitLimit >= 100) {
                return 100
            } else if (splitLimit < 100) {
                return 100
            }
        }
        async function run() {
            do {
                if (counter > 9) {
                    if (filter.includes('silent')) return false
                    else {
                        await embed.addFields({
                            name: 'I Checked through 1000 messages',
                            value: 'I have stopped because there were no matches in those 1000.'
                        })
                        var File = await new MessageAttachment(Buffer.from(await findFileData(), 'utf8'), 'purge.txt');
                        await hastebin.createPaste(findFileData(), { server: 'https://hastebin.com/' })
                            .catch(function (e) {
                                embed.setDescription(`:wastebasket: ${messagesToDelete.length} messages deleted in ${message.channel} (Hastebin could not be created)`)
                                return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                            })
                            .then(async url => {
                                embed.setDescription(`:wastebasket: ${messagesToDelete.length} messages deleted in ${message.channel} (${url ?? "Hastebin could not be created"})`)
                                return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                            })
                        return message.reply({ embeds: [embed], allowedMentions: { users: [] } })
                    }
                }
                var toFetch: any = findNextLimit()
                await message.channel.messages.fetch({ limit: toFetch }).then(async (messages: any) => {
                    var messages2 = messages;
                    if (message.mentions.users.first()) messages2 = messages2.filter((msg: any) => msg.author.id == message.mentions.users.first().id)
                    if (filter.includes('bots')) messages2 = messages2.filter((msg: any) => msg.author.bot)
                    if (filter.includes('users')) messages2 = messages2.filter((msg: any) => !msg.author.bot)
                    if (filter.includes('links')) {
                        messages2 = messages2.filter((msg: any) => { if (msg.content.includes('http://' || 'https://')) { return true; } else { return false } })
                    }
                    if (filter.includes('invites')) messages2 = messages2.filter((msg: any) => { if (msg.content.includes('discord.gg/' || 'discordapp.com/invite/' || 'discord.com/invite/')) return true; else return false })
                    if (filter.includes('embeds')) messages2 = messages2.filter((msg: any) => msg.embeds.length > 0)
                    if (filter.includes('images')) messages2 = messages2.filter((msg: any) => msg.attachments.first().height != null)
                    if (filter.includes('files')) messages2 = messages2.filter((msg: any) => msg.attachments.size > 0)
                    if (filter.includes('mentions')) messages2 = messages2.filter((msg: any) => msg.mentions.users.size > 0)
                    if (filter.includes('pins')) messages2 = messages2.filter((msg: any) => msg.pinned)
                    else if (!filter.includes('pins')) messages2 = messages2.filter((msg: any) => !msg.pinned)
                    if (toFetch > splitLimit) messages2 = messages2.first(splitLimit)
                    messages2 = messages2.filter((filterMessage: any) => ((new Date().getTime() - new Date(filterMessage.createdAt.getTime()).getTime()) / (1000 * 3600 * 24)) < 14)
                    splitLimit = splitLimit - messages2.size
                    if (messages2.size == 0) counter++
                    else if (messages2.size > 0) counter = 0
                    try {
                        var toConcat = new Array()
                        messages2.forEach((x: any) => {
                            toConcat.push(x)
                        })
                        messagesToDelete = messagesToDelete.concat(toConcat)
                        if (messages2.length !== 0) {
                            message.channel.bulkDelete(messages2)
                        }
                    } catch (e) { }
                })
            } while (splitLimit > 0 && counter < 11)
            
            function findFileData() {
                let dataToWrite = '';
                messagesToDelete.reverse()
                dataToWrite += `${messagesToDelete.length} deleted in #${message.channel.name} | ${message.channel.id}:\n\n`
                messagesToDelete.forEach((m: any) => {
                    if (!m) return
                    if (m.size) {
                        if (m.size > 0) {
                            m = m.values().next().value
                        }
                    }
                    dataToWrite += `${m.author.tag} | ${m.author.id} - MessageID: ${m.id} - ${m.createdAt.toLocaleString()}\n${m.content.toString()}\n\n`
                    if (m.attachments.size > 0) {
                        m.attachments.forEach((attachment: any) => {
                            dataToWrite += `${attachment.url}\n`
                        })
                    }
                    dataToWrite += `\n`
                })
                messagesToDelete.reverse()
                return dataToWrite
            }
            // Implement botlog channel but for now just send to public chat
            var File = await new MessageAttachment(Buffer.from(await findFileData(), 'utf8'), 'purge.txt');
            await hastebin.createPaste(findFileData(), { server: 'https://hastebin.com/' })
                .catch(function (e) {
                    embed.setDescription(`:wastebasket: ${messagesToDelete.length} messages deleted in ${message.channel} (Hastebin could not be created)`)
                    message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                })
                .then(async url => {
                    embed.setDescription(`:wastebasket: ${messagesToDelete.length} messages deleted in ${message.channel} (${url ?? "Hastebin could not be created"})`)
                    message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                })
                if (!filter.includes('silent')) {
                    embed.setDescription('I have deleted ' + messagesToDelete.length + ' messages!')
                    return message.channel.send({ embeds: [embed], allowedMentions: { users: [] } })
                }
        }
        if (!filter.includes('silent')) {
            try {

                await message.channel.send({ content: `Are you sure you want to delete ${limit} messages?` }).then(async (message3: Message) => {


                    message3.react('✅')
                    message3.react('❌')

                    // const filter = (reaction: MessageReaction, user: User) => {
                    //     return user.id === message.author.id
                    // }
                    // const collector = message3.createReactionCollector({
                    //     filter,
                    //     max: 1,
                    //     time: 1000*60
                    // })
                    // collector.on('collect', (reaction: MessageReaction) => {
                    //     console.log(reaction)
                    // })
                    // const filter1 = (reaction:any, user:any) => {
                    //     console.log(reaction, user)
                    //     return true //user.id === message.author.id
                    // };
                    // const collector = await message3.createReactionCollector(filter1, {
                    //     max: 1,
                    //     time: 60000
                    // });
                    // collector.on('collect', async (reaction:any, user:any) => {
                    //     if (reaction.emoji.name === '👍') {
                    //         await message.delete()
                    //         await message3.delete()
                    //         run()

                    //     } else if (reaction.emoji.name === '👎') return message.channel.send('Ended')
                    // });


                    // console.log(message3)
                    var filter = (reaction: any, user: any) => {
                        console.log(reaction)
                        console.log(['✅', '❌'].includes(reaction.emoji.name), user.id == message.author.id)
                        // return true
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id == message.author.id
                    }
                    var collector = await message3.createReactionCollector({ filter, max: 1, time: 60000 })
                    collector.on('collect', async (reaction: any, user: any) => {
                        console.log(reaction)
                        if (reaction.emoji.name == '✅') {
                            await message.delete()
                            await collector.stop()
                            await run()
                        } else if (reaction.emoji.name == '❌') {
                            await collector.stop()
                        }
                    })
                })
            } catch (e) {
                console.log(e)
            }

        } else if (filter.includes('silent')) {
            await message.delete()
            await run()
        }
    }
}