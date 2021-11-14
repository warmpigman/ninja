module.exports = {
    name: ["trade-ban"],
    category: "Mod",
    description: "Ban a member from accessing the trade channel",
    usage: "trade-ban [@user or user id]",
    examples: [
        "trade-ban 406920919131488268",
        "trade-ban <@406920919131488268>"
    ],
    hidden: ["mod"],
    async execute(message: any, args: Array<string>, client: any, paguClient: any) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTimestamp()
        if (!message.member.permissions.has(["MANAGE_ROLES"])) {
            embed.addFields({
                name: "Error",
                value: "You do not have sufficient permissions to use this command."
            })
            return message.reply({ embeds: [embed] })
        } else {
            
        }
    }
}