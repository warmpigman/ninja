import * as Path from 'path'
import * as fs from 'fs'
import * as Chalk from 'chalk'
module.exports = function (options: any, paguClient: any) {
    try {
        let path = Path.join(process.cwd(), options.options.commandDir ?? "dist/src/Commands")
        console.log(path)
        if (!fs.existsSync(path)) path = Path.join(process.cwd(), "dist/src/commands")
        console.log(path)
        if (!fs.existsSync(path)) throw "The \"commands\" folder could not be found \n Try initalizing the client with a commandDir leading to your commands folder."
        function registerCommands(path: string) {
            fs.readdirSync(path).forEach((file: string) => {
                if (fs.lstatSync(Path.join(path, file)).isDirectory()) {
                    registerCommands(Path.join(path, file))
                } else {
                    const commandFile = require(Path.join(path, file))
                    var category = "None"
                    if (!commandFile.category) {
                        paguClient.Util.log(__filename, "warn", `${file} doesn't contain a category and such will be put in the None category.`)
                    } else category = commandFile.category
                    if (commandFile.name) {
                        if (commandFile.name[0]) {
                            paguClient.commands.set(file, { commandFile: commandFile, cache: { category: category, loaded: true, name: file } })
                            options.client.on('messageCreate', async (message: any) => {
                                for (const alias of commandFile.name) {

                                    if (message.author.bot) return;
                                    var args = message.content.split(/[ ]+/)
                                    if ((args[0].toLowerCase() == `${process.env.PREFIX}${alias}` || (message.mentions.has(options.client.user) && args[1] == alias)) && message.guild !== null) {
                                        // if(message.guild.id=="835220768110805043") return message.reply('no')
                                        args.shift()
                                        if ((commandFile.perms && !message.member.hasPermission(commandFile.perms, { checkAdmin: true, checkOwner: true })) && message.author.id !== "406920919131488268") {
                                            return message.reply(`You are missing permissions to use this command.`);
                                        } else {
                                            async function checkCooldown() {
                                                var returnBoolean = true
                                                if (paguClient.cache.internal.cooldowns[commandFile.name[0]] > Date.now()) { }
                                                else {
                                                    paguClient.cache.internal.cooldowns[commandFile.name[0]] = Date.now() + commandFile.cooldown
                                                    returnBoolean = false
                                                }
                                                return returnBoolean
                                            }
                                            if (commandFile.cooldown && await checkCooldown()) return message.reply(`You are currently on cooldown for ${await paguClient.Util.findTimeUntil(new Date(), paguClient.cache.internal.cooldowns[commandFile.name[0]])}`)
                                            commandFile.execute(message, args, options.client, paguClient)
                                        }
                                        // 
                                    }
                                }
                            })

                        }
                    } else {
                        paguClient.commands.set(file, { commandFile: commandFile, cache: { category: category, loaded: false, name: file } })
                        paguClient.Util.log(__filename, "warn", `${file} doesn't contain a name and such will not be loaded`)
                    }
                }
            });
        }
        Promise.all([registerCommands(path), registerCommands(Path.join(process.cwd(), "/dist/pagu/commands"))])

        var commands = new Array()
        paguClient.commands.forEach((command: any) => {
            let name = Chalk.yellowBright(Path.basename(command.cache.name, Path.extname(command.cache.name))); if (command.commandFile.name) { if (command.commandFile.name[0]) { name = Chalk.cyanBright(command.commandFile.name[0]) } }
            commands.push({
                name: name,
                loaded: command.cache.loaded
            })
        })
        console.table(commands.reduce((acc: any, { name, ...x }) => { acc[name] = x; return acc }, {}))

    } catch (e) {
        paguClient.Util.log(__filename, "error", e, true)
    }

}