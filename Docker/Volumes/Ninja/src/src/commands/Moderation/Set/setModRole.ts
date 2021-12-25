module.exports = {
    name: ["setmodrole", "set-mod-role", "set-modrole"],
    category: "Mod",
    description: "Set's the guild's mod role to mute people with.",
    usage: "setmuterequestrole [ID or #role]",
    examples: [
        "setmodrole @mod",
        "setmodrole 212148329245020082",
    ],
    permissions: ["MANAGE_roleS"],
    hidden: ["mod"],
    async execute(message: any, args: Array<string>, client: any, paguClient: any) {
        if ((await paguClient.Util.resolveRole(args, message, 0) == "none")) {
            console.log(await paguClient.Util.resolveRole(args, message, 0) == "none")
            return message.reply(`You must specify a valid role to set.`)
        }
        var roleID = await paguClient.Util.resolveRole(args, message, 0)
        const guildSchema = await paguClient.schemas.get('guild')
        guildSchema.findOne({
            guildID: message.guild.id
        }, (err: Error, data: any) => {
            if (err) {
                console.log(err)
                return message.reply({ content: `An error has occured, please try again later.` })
            } else {
                if (!data) {
                    guildSchema.create({
                        guildID: message.guild.id,
                        modRole: {
                            ID: roleID,
                            Set: true
                        }
                    })
                    return message.reply({ content: `<@&${roleID}> has been set as the mod role.`, allowedMentions: {} })
                } else if (data) {
                    if (data.modRole.ID == roleID) {
                        return message.reply({ content: `<@&${roleID}> is already the mod role.` })
                    } else {
                        data.modRole.ID = roleID
                        data.modRole.Set = true
                        data.save()
                        return message.reply({ content: `<@&${roleID}> has been set as the mod role.` })
                    }
                }
            }
        })
    }
}