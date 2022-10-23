import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
  name: ["help", "whatis"],
  category: "Utility",
  description: "Helps show information about the bot's commands!",
  usage: "help {Either category or command}",
  examples: ["help", "help eco", "help bal"],
  // slashInit() {
  //   return new SlashCommandBuilder()
  //     .setName("help")
  //     .setDescription("Helps show information about the bot's commands!")
  //     .addStringOption((option) =>
  //       option
  //         .setName("command")
  //         .setDescription("The command to get help for")
  //         .setRequired(false)
  //     )
  //     .addStringOption((option) =>
  //       option
  //         .setName("category")
  //         .setDescription("The category to get help for")
  //         .setRequired(false)
  //     );
  // },
  // async slashExecute(
  //   interaction: CommandInteraction,
  //   client: any,
  //   paguClient: any
  // ) {
  //   if (!interaction.isCommand()) return;
  //   if(!interaction || !interaction.member) return;
  //   var list = paguClient.commands;
  //   list.sweep((command: any) => !command.cache.loaded);
  //   list = list.map((command: any) => JSON.stringify(command, null, "\t"));
  //   var embed = new paguClient.Discord.MessageEmbed()
  //     .setFooter(
  //       interaction.user.tag + " | " + client.user.username,
  //       interaction.user.displayAvatarURL({ dynamic: true })
  //     )
  //     .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
  //     .setTimestamp();
  //   var categories = new Map();
  //   new Promise((resolve: any) => {
  //     list.forEach(async (command: any) => {
  //       var hiddenToUser = Boolean();
  //       if (JSON.parse(command).commandFile.hidden) {
  //         const hiddenTypes = JSON.parse(command).commandFile.hidden;
  //         if (hiddenTypes) {
  //           hiddenTypes.forEach((hiddenType: string) => {
  //             switch (hiddenType.toLowerCase()) {
  //               case "dev": {
  //                 if (
  //                   paguClient.options.options.devs.includes(interaction.user.id)
  //                 ) {
  //                   hiddenToUser = false;
  //                   break;
  //                 } else {
  //                   hiddenToUser = true;
  //                   break;
  //                 }
  //               }
  //               case "admin": {
  //                 if (
  //                   interaction?.memberPermissions?.has("ADMINISTRATOR") ||
  //                   //@ts-ignore
  //                   interaction.member.roles.cache?.find(
  //                     (r: any) => r.name.toLowerCase() == "admin"
  //                   )
  //                 ) {
  //                   hiddenToUser = false;
  //                   break;
  //                 } else {
  //                   hiddenToUser = true;
  //                   break;
  //                 }
  //               }
  //               case "mod" || "moderator": {
  //                 if (
  //                   //@ts-ignore
  //                   interaction?.member.permissions.has("ADMINISTRATOR") ||
  //                   //@ts-ignore
  //                   interaction.member.roles.cache.find(
  //                     (r: any) => r.name.toLowerCase() == "mod"
  //                   ) ||
  //                   //@ts-ignore
  //                   interaction.member.roles.cache.find(
  //                     (r: any) => r.name.toLowerCase() == "moderator"
  //                   )
  //                 ) {
  //                   hiddenToUser = false;
  //                   break;
  //                 } else {
  //                   hiddenToUser = true;
  //                   break;
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //       if (hiddenToUser) return;
  //       var commands = [];
  //       if (categories.get(JSON.parse(command).cache.category)) {
  //         commands = categories.get(
  //           JSON.parse(command).cache.category
  //         ).commands;
  //       }
  //       commands.push({
  //         name: JSON.parse(command).commandFile.name[0],
  //         commandFile: JSON.parse(command).commandFile,
  //         description:
  //           JSON.parse(command).commandFile.description ?? "No description set",
  //       });
  //       let cleanName =
  //         paguClient.options.options.niceCategory[
  //         JSON.parse(command).cache.category.toLowerCase()
  //         ];
  //       if (!cleanName) cleanName = JSON.parse(command).cache.category;
  //       categories.set(JSON.parse(command).cache.category, {
  //         cleanName: cleanName,
  //         commands: commands,
  //         justCommands: commands.map((Command: any) => Command.name),
  //       });
  //       embed.setTitle("Help");
  //     });
  //     if(interaction.options.get("command") !== null) {
  //       const command = interaction.options.getString("command");
  //       const commandFile = paguClient.commands.get(command);
  //       if(!commandFile) {
  //         return interaction.reply({content: "That command doesn't exist!", ephemeral: true});
  //       }
  //       embed.setTitle("Help for " + commandFile.cache.name[0]);
  //       embed.setDescription(commandFile.cache.description);
  //       embed.addField("Usage", commandFile.cache.usage);
  //       embed.addField("Examples", commandFile.cache.examples.join(", "));
  //       return interaction.reply({embeds: [embed]});
  //     }
  //    /*
  //     if (interaction.options.get("command")) {
  //       var useHelp = true;
  //       categories.forEach((category: any) => {
  //         if (
  //           category.cleanName
  //             .toLowerCase()
  //             .includes(args[0].toString().toLowerCase())
  //         ) {
  //           useHelp = false;
  //           embed.setTitle(`${category.cleanName} Commands:`);
  //           category.commands.forEach((command: any) => {
  //             embed.addFields({
  //               name:
  //                 paguClient.options.options.niceCommands[
  //                 command.name.toLowerCase()
  //                 ] ?? command.name,
  //               value: command.description,
  //               inline: true,
  //             });
  //           });
  //         } else if (
  //           category.justCommands
  //             .map((command: any) => command.toString().toLowerCase())
  //             .includes(args[0].toString().toLowerCase())
  //         ) {
  //           useHelp = false;
  //           const command = category.commands.filter((Command: any) => {
  //             return (
  //               Command.name.toLowerCase() == args[0].toString().toLowerCase()
  //             );
  //           })[0];
  //           embed.setTitle(
  //             paguClient.options.options.niceCommands[
  //             command.name.toLowerCase()
  //             ] ?? command.name.toLowerCase()
  //           );
  //           var alternatives = command.commandFile.name;
  //           alternatives.shift();
  //           if (alternatives.length == 0) {
  //             alternatives = "No alternatives";
  //           } else alternatives = alternatives.join(", ");
  //           embed.addFields(
  //             { name: "Alternatives", value: alternatives },
  //             { name: "Description", value: command.description.toString() },
  //             {
  //               name: "Usage",
  //               value: command.commandFile.usage ?? "No usage set",
  //             },
  //             {
  //               name: "Examples",
  //               value:
  //                 command.commandFile.examples.join(",\n") ?? "No examples set",
  //             }
  //           );
  //         }
  //       });
  //       if (useHelp) {
  //         var index = 0;
  //         categories.forEach(async (category: any) => {
  //           index++;
  //           await embed.addFields({
  //             name: category.cleanName,
  //             value: `${category.commands.length} Commands`,
  //             inline: true,
  //           });
  //           if (index == categories.size) await resolve();
  //         });
  //       } else resolve();
  //     } else {
  //       var index = 0;
  //       categories.forEach(async (category: any) => {
  //         index++;
  //         await embed.addFields({
  //           name: category.cleanName,
  //           value: `${category.commands.length} Commands`,
  //           inline: true,
  //         });
  //         if (index == categories.size) await resolve();
  //       });
  //     }
  //     */

  //   }).then(() => {
  //     interaction.reply({ embeds: [embed] });
  //   });

  // },
  async execute(
    message: any,
    args: Array<string>,
    client: any,
    paguClient: any
  ) {
    var list = paguClient.commands;
    list.sweep((command: any) => !command.cache.loaded);
    list = list.map((command: any) => JSON.stringify(command, null, "\t"));
    var embed = new paguClient.Discord.MessageEmbed()
      .setFooter(
        message.author.tag + " | " + client.user.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTimestamp();
    var categories = new Map();
    new Promise((resolve: any) => {
      list.forEach(async (command: any) => {
        var hiddenToUser = Boolean();
        if (JSON.parse(command).commandFile.hidden) {
          const hiddenTypes = JSON.parse(command).commandFile.hidden;
          if (hiddenTypes) {
            hiddenTypes.forEach((hiddenType: string) => {
              switch (hiddenType.toLowerCase()) {
                case "dev": {
                  if (
                    paguClient.options.options.devs.includes(message.author.id)
                  ) {
                    hiddenToUser = false;
                    break;
                  } else {
                    hiddenToUser = true;
                    break;
                  }
                }
                case "admin": {
                  if (
                    message.member.permissions.has("ADMINISTRATOR") ||
                    message.member.roles.cache.find(
                      (r: any) => r.name.toLowerCase() == "admin"
                    )
                  ) {
                    hiddenToUser = false;
                    break;
                  } else {
                    hiddenToUser = true;
                    break;
                  }
                }
                case "mod" || "moderator": {
                  if (
                    message.member.permissions.has("ADMINISTRATOR") ||
                    message.member.roles.cache.find(
                      (r: any) => r.name.toLowerCase() == "mod"
                    ) ||
                    message.member.roles.cache.find(
                      (r: any) => r.name.toLowerCase() == "moderator"
                    )
                  ) {
                    hiddenToUser = false;
                    break;
                  } else {
                    hiddenToUser = true;
                    break;
                  }
                }
              }
            });
          }
        }
        if (hiddenToUser) return;
        var commands = [];
        if (categories.get(JSON.parse(command).cache.category)) {
          commands = categories.get(
            JSON.parse(command).cache.category
          ).commands;
        }
        commands.push({
          name: JSON.parse(command).commandFile.name[0],
          commandFile: JSON.parse(command).commandFile,
          description:
            JSON.parse(command).commandFile.description ?? "No description set",
        });
        let cleanName =
          paguClient.options.options.niceCategory[
            JSON.parse(command).cache.category.toLowerCase()
          ];
        if (!cleanName) cleanName = JSON.parse(command).cache.category;
        categories.set(JSON.parse(command).cache.category, {
          cleanName: cleanName,
          commands: commands,
          justCommands: commands.map((Command: any) => Command.name),
        });
        embed.setTitle("Help");
      });
      if (args.length > 0) {
        var useHelp = true;
        categories.forEach((category: any) => {
          if (
            category.cleanName
              .toLowerCase()
              .includes(args[0].toString().toLowerCase())
          ) {
            useHelp = false;
            embed.setTitle(`${category.cleanName} Commands:`);
            category.commands.forEach((command: any) => {
              embed.addFields({
                name:
                  paguClient.options.options.niceCommands[
                    command.name.toLowerCase()
                  ] ?? command.name,
                value: command.description,
                inline: true,
              });
            });
          } else if (
            category.justCommands
              .map((command: any) => command.toString().toLowerCase())
              .includes(args[0].toString().toLowerCase())
          ) {
            useHelp = false;
            const command = category.commands.filter((Command: any) => {
              return (
                Command.name.toLowerCase() == args[0].toString().toLowerCase()
              );
            })[0];
            embed.setTitle(
              paguClient.options.options.niceCommands[
                command.name.toLowerCase()
              ] ?? command.name.toLowerCase()
            );
            var alternatives = command.commandFile.name;
            alternatives.shift();
            if (alternatives.length == 0) {
              alternatives = "No alternatives";
            } else alternatives = alternatives.join(", ");
            embed.addFields(
              { name: "Alternatives", value: alternatives },
              { name: "Description", value: command.description.toString() },
              {
                name: "Usage",
                value: command.commandFile.usage ?? "No usage set",
              },
              {
                name: "Examples",
                value:
                  command.commandFile.examples.join(",\n") ?? "No examples set",
              }
            );
          }
        });
        if (useHelp) {
          var index = 0;
          categories.forEach(async (category: any) => {
            index++;
            await embed.addFields({
              name: category.cleanName,
              value: `${category.commands.length} Commands`,
              inline: true,
            });
            if (index == categories.size) await resolve();
          });
        } else resolve();
      } else {
        var index = 0;
        categories.forEach(async (category: any) => {
          index++;
          await embed.addFields({
            name: category.cleanName,
            value: `${category.commands.length} Commands`,
            inline: true,
          });
          if (index == categories.size) await resolve();
        });
      }
    }).then(() => {
      message.channel.send({ embeds: [embed] });
    });
  },
};
