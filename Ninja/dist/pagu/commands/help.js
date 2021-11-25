"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: ["help", "whatis"],
    category: "Utility",
    description: "Helps show information about the bot's commands!",
    usage: "help {Either category or command}",
    examples: [
        "help",
        "help eco",
        "help bal"
    ],
    async execute(message, args, client, paguClient) {
        var list = paguClient.commands;
        list.sweep((command) => !command.cache.loaded);
        list = list.map((command) => JSON.stringify(command, null, "\t"));
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTimestamp();
        var categories = new Map;
        new Promise((resolve) => {
            list.forEach(async (command) => {
                var hiddenToUser = Boolean();
                if (JSON.parse(command).commandFile.hidden) {
                    const hiddenTypes = JSON.parse(command).commandFile.hidden;
                    if (hiddenTypes) {
                        hiddenTypes.forEach((hiddenType) => {
                            switch (hiddenType.toLowerCase()) {
                                case "dev": {
                                    if (paguClient.options.options.devs.includes(message.author.id)) {
                                        hiddenToUser = false;
                                        break;
                                    }
                                    else {
                                        hiddenToUser = true;
                                        break;
                                    }
                                }
                                case "admin": {
                                    if (message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.find((r) => r.name.toLowerCase() == "admin")) {
                                        hiddenToUser = false;
                                        break;
                                    }
                                    else {
                                        hiddenToUser = true;
                                        break;
                                    }
                                }
                                case "mod" || "moderator": {
                                    if (message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.find((r) => r.name.toLowerCase() == "mod") || message.member.roles.cache.find((r) => r.name.toLowerCase() == "moderator")) {
                                        hiddenToUser = false;
                                        break;
                                    }
                                    else {
                                        hiddenToUser = true;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
                if (hiddenToUser)
                    return;
                var commands = [];
                if (categories.get(JSON.parse(command).cache.category)) {
                    commands = categories.get(JSON.parse(command).cache.category).commands;
                }
                commands.push({ name: JSON.parse(command).commandFile.name[0], commandFile: JSON.parse(command).commandFile, description: JSON.parse(command).commandFile.description ?? "No description set" });
                let cleanName = paguClient.options.options.niceCategory[JSON.parse(command).cache.category.toLowerCase()];
                if (!cleanName)
                    cleanName = JSON.parse(command).cache.category;
                categories.set(JSON.parse(command).cache.category, {
                    cleanName: cleanName,
                    commands: commands,
                    justCommands: commands.map((Command) => Command.name)
                });
                embed.setTitle("Help");
            });
            if (args.length > 0) {
                var useHelp = true;
                categories.forEach((category) => {
                    if (category.cleanName.toLowerCase().includes(args[0].toString().toLowerCase())) {
                        useHelp = false;
                        embed.setTitle(`${category.cleanName} Commands:`);
                        category.commands.forEach((command) => {
                            embed.addFields({ name: paguClient.options.options.niceCommands[command.name.toLowerCase()] ?? command.name, value: command.description, inline: true });
                        });
                    }
                    else if (category.justCommands.map((command) => command.toString().toLowerCase()).includes(args[0].toString().toLowerCase())) {
                        useHelp = false;
                        const command = category.commands.filter((Command) => {
                            return Command.name.toLowerCase() == args[0].toString().toLowerCase();
                        })[0];
                        embed.setTitle(paguClient.options.options.niceCommands[command.name.toLowerCase()] ?? command.name.toLowerCase());
                        var alternatives = command.commandFile.name;
                        alternatives.shift();
                        if (alternatives.length == 0) {
                            alternatives = "No alternatives";
                        }
                        else
                            alternatives = alternatives.join(", ");
                        console.log(alternatives);
                        embed.addFields({ name: "Alternatives", value: alternatives }, { name: "Description", value: command.description.toString() }, { name: "Usage", value: command.commandFile.usage ?? "No usage set" }, { name: "Examples", value: command.commandFile.examples.join(",\n") ?? "No examples set" });
                    }
                });
                if (useHelp) {
                    var index = 0;
                    categories.forEach(async (category) => {
                        index++;
                        await embed.addFields({ name: category.cleanName, value: `${category.commands.length} Commands`, inline: true });
                        console.log(index, categories.size, 1);
                        if (index == categories.size)
                            await resolve();
                    });
                }
                else
                    resolve();
            }
            else {
                var index = 0;
                categories.forEach(async (category) => {
                    index++;
                    await embed.addFields({ name: category.cleanName, value: `${category.commands.length} Commands`, inline: true });
                    console.log(index, categories.size);
                    if (index == categories.size)
                        await resolve();
                });
            }
        }).then(() => {
            message.channel.send({ embeds: [embed] });
        });
    }
};
