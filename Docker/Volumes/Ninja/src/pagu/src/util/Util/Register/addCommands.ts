import * as Path from "path";
import * as fs from "fs";
import * as Chalk from "chalk";
import { Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
function resolveType(commandFile: any) {
  if (commandFile.slashInit) {
    return "slash";
  } else {
    return "message";
  }
}
module.exports = function (options: any, paguClient: any) {
  try {
    let path = Path.join(
      process.cwd(),
      options.options.commandDir ?? "dist/src/Commands"
    );
    if (!fs.existsSync(path))
      path = Path.join(process.cwd(), "dist/src/commands");
    if (!fs.existsSync(path))
      throw 'The "commands" folder could not be found \n Try initalizing the client with a commandDir leading to your commands folder.';
    function registerCommands(path: string) {
      fs.readdirSync(path).forEach(async (file: string) => {
        if (fs.lstatSync(Path.join(path, file)).isDirectory()) {
          registerCommands(Path.join(path, file));
        } else {
          const commandFile = require(Path.join(path, file));
          var category = "None";
          if (!commandFile.category) {
            paguClient.Util.log(
              __filename,
              "warn",
              `${file} doesn't contain a category and such will be put in the None category.`
            );
          } else category = commandFile.category;
          if (commandFile.name) {
            if (commandFile.name[0]) {
              paguClient.commands.set(file, {
                commandFile: commandFile,
                cache: {
                  category: category,
                  loaded: true,
                  name: file,
                  type: resolveType(commandFile),
                },
              });
            }
          } else {
            paguClient.commands.set(file, {
              commandFile: commandFile,
              cache: {
                category: category,
                loaded: false,
                name: file,
                type: resolveType(commandFile),
              },
            });
            paguClient.Util.log(
              __filename,
              "warn",
              `${file} doesn't contain a name and such will not be loaded`
            );
          }
        }
      });
    }
    Promise.all([
      registerCommands(path),
      registerCommands(Path.join(process.cwd(), "/dist/pagu/commands")),
    ]).then(() => {
      var valids = new Map();
      var origValids = new Map();
      let index = 0;
      paguClient.commands.forEach((command: any, key: any) => {
        if (command.cache.loaded) {
          for (const commandName of command.commandFile.name) {
            if (valids.has(commandName)) {
              paguClient.Util.log(
                __filename,
                "warn",
                `Command ${commandName} is already registered.`
              );
            } else {
              valids.set(commandName, command);
            }
          }
          if (origValids.has(command.commandFile.name[0])) {
            paguClient.Util.log(
              __filename,
              "warn",
              `Command ${command.commandFile.name[0]} is already registered.`
            );
          } else {
            origValids.set(command.commandFile.name[0], command);
          }
        }
        if (index == paguClient.commands.size - 1) {
          options.client.on("messageCreate", async (message: any) => {
            if (message.author.bot) return;
            if (
              message.content.startsWith(process.env.PREFIX) ||
              (message.mentions.has(options.client.user) &&
                Object.keys(valids).includes(args[1]))
            ) {
              if (message.channel.type == "dm")
                return message.reply("You can't use commands in DMs!");
              var args = message.content.split(/[ ]+/);
              const rawCommandFile = valids.get(
                args[0].toLowerCase().substring(process.env.PREFIX?.length)
              );
              if (!rawCommandFile) return;
              const commandFile = rawCommandFile.commandFile;
              if (rawCommandFile.cache.type == "slash") {
                return;
              }
              if (commandFile) {
                args.shift();
                if (
                  (commandFile.perms ?? commandFile.permissions) &&
                  !message.member.permissions.has(
                    commandFile.perms ?? commandFile.permissions,
                    { checkAdmin: true, checkOwner: true }
                  )
                ) {
                  return message.channel.send(
                    `You are missing permissions to use this command.`
                  );
                } else {
                  async function checkCooldown() {
                    var returnBoolean = true;
                    if (
                      paguClient.cache.internal.cooldowns[commandFile.name[0]] >
                      Date.now()
                    ) {
                    } else {
                      paguClient.cache.internal.cooldowns[commandFile.name[0]] =
                        Date.now() + commandFile.cooldown;
                      returnBoolean = false;
                    }
                    return returnBoolean;
                  }
                  if (commandFile.cooldown && (await checkCooldown()))
                    return message.channel.send(
                      `You are currently on cooldown for ${await paguClient.Util.findTimeUntil(
                        new Date(),
                        paguClient.cache.internal.cooldowns[commandFile.name[0]]
                      )}`
                    );
                  try {
                    commandFile.execute(
                      message,
                      args,
                      options.client,
                      paguClient
                    );
                  } catch (e) {
                    console.log(e);
                    message.reply(
                      `An error occured while executing the command. Please report this!`
                    );
                  }
                }
              }
            }
          });
          // interactionCreate
          var validSlashes = origValids;
          for (let k of validSlashes.keys()) {
            if (validSlashes.get(k).cache.type !== "slash") {
              validSlashes.delete(k);
            }
          }
          options.client.on(
            "interactionCreate",
            async (interaction: Interaction) => {
              if (!interaction.isCommand()) return;
              var Command = validSlashes.get(interaction.commandName);
              if (!Command) {
                interaction.reply({
                  content: "Command not found",
                  ephemeral: true,
                });
              } else {
                try {
                  Command.commandFile.execute(
                    interaction,
                    options.client,
                    paguClient
                  );
                } catch (e) {
                  console.log(e);
                  interaction.reply({
                    content:
                      "An error occured while executing the command. Please report this!",
                    ephemeral: true,
                  });
                }
              }
            }
          );
          // add per server commands for dev servers
          var validSlashCommands = new Array();
          var i = 0;
          origValids.forEach(async (validCommand: any) => {
            if (validCommand.cache.type == "slash")
              validSlashCommands.push(validCommand);
            if (i == origValids.size - 1) {
              var slashCommands = await validSlashCommands.map((slash: any) =>
                slash.commandFile.slashInit().toJSON()
              );
              paguClient.Util.log(
                __filename,
                "log",
                `Loading ${validSlashCommands.length} slash commands to per server commands.`
              );
              paguClient.options.options.devServers.forEach(
                async (server: string) => {
                  if (slashCommands.length > 0) {
                    try {
                      //@ts-expect-error
                      const rest = new REST({ vesrion: "9" }).setToken(
                        options.client.token
                      );
                      await rest.put(
                        Routes.applicationGuildCommands(
                          options.client.application.id,
                          server
                        ),
                        {
                          body: slashCommands,
                        }
                      );
                      paguClient.Util.log(
                        __filename,
                        "log",
                        `Successfully loaded per server commands to ${server}`
                      );
                    } catch (e) {
                      paguClient.Util.log(
                        __filename,
                        "error",
                        `Failed to add per server commands to ${server}`
                      );
                      console.log(e);
                    }
                  }
                }
              );
            }
            i++;
          });
        }
        index++;
      });
    });

    var commands = new Array();
    paguClient.commands.forEach((command: any) => {
      let name = Chalk.yellowBright(
        Path.basename(command.cache.name, Path.extname(command.cache.name))
      );
      if (command.commandFile.name) {
        if (command.commandFile.name[0]) {
          name = Chalk.cyanBright(command.commandFile.name[0]);
        }
      }
      commands.push({
        name: name,
        loaded: command.cache.loaded,
      });
    });
    console.table(
      commands.reduce((acc: any, { name, ...x }) => {
        acc[name] = x;
        return acc;
      }, {})
    );
  } catch (e) {
    paguClient.Util.log(__filename, "error", e, true);
  }
};
