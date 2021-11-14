"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
module.exports = {
    name: ["verify"],
    category: "Hypixel",
    description: "Verify your discord account with your hypixel account.",
    usage: "verify [Minecraft Username]",
    examples: [
        "verify Warmpigman"
    ],
    execute(message, args, client, paguClient) {
        var embed = new paguClient.Discord.MessageEmbed()
            .setFooter(message.author.tag + ' | ' + client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .setTimestamp()
            .setTitle('Verify');
        if (!args[0]) {
            embed.addFields({
                name: "How to verify",
                value: `Please follow the correct command format, try using, "${module.exports.usage}"`
                // value: "1. Go to any main lobby\n2. Type \"/profile\" in the in-game chat and press enter\n3. Find the icon called \"Social Media\"\n4.Find the icon called \"Discord\"\n5.Go to the Discord app and click on your name on the bottom left to copy your Discord tag\n6. Go back in game and paste that copied tag into the chat and press enter\n7. If a book pops up, click \"I understand\"\n8. Then go try issuing this command again"
            });
            return message.reply({ embeds: [embed] });
        }
        else {
            (0, axios_1.default)(`https://api.mojang.com/users/profiles/minecraft/${args[0].toString()}`, {
                validateStatus: function (status) {
                    return status < 500;
                },
            })
                .then((mojangRes) => {
                if (!mojangRes.data.id) {
                    embed.addFields({
                        name: "Failed!",
                        value: "Not a valid username or a mojang error occured.",
                    });
                    return message.reply({
                        embeds: [embed]
                    });
                }
                else {
                    (0, axios_1.default)(`https://api.hypixel.net/player?uuid=${mojangRes.data.id}&key=c2d06b71-ea84-46db-95ff-319bc7f03fe9`)
                        .then(async (res) => {
                        if (!res.data.player || !res.data.player.socialMedia) {
                            embed.addFields({
                                name: "How to verify",
                                value: "1. Go to any main lobby\n2. Type \"/profile\" in the in-game chat and press enter\n3. Find the icon called \"Social Media\"\n4.Find the icon called \"Discord\"\n5.Go to the Discord app and click on your name on the bottom left to copy your Discord tag\n6. Go back in game and paste that copied tag into the chat and press enter\n7. If a book pops up, click \"I understand\"\n8. Then go try issuing this command again"
                            });
                            var video = new paguClient.Discord.MessageAttachment('https://i.gyazo.com/3a2358687dae9b4333fd2fef932e0a17.mp4');
                            return message.reply({ embeds: [embed], files: [video] });
                        }
                        if (res.data.player.socialMedia.links.DISCORD) {
                            if (message.author.tag ==
                                res.data.player.socialMedia.links.DISCORD) {
                                embed.addFields({
                                    name: "Success!",
                                    value: `Your discord and hypixel discord link matched!`,
                                });
                                message.guild.roles.fetch().then(roles => {
                                    let tradeVerifiedRole = roles.find((r) => r.name.toLowerCase() === "trade verified");
                                    if (tradeVerifiedRole) {
                                        try {
                                            message.member.roles.add(tradeVerifiedRole);
                                        }
                                        catch (e) {
                                            message.channel.send({ content: "I do not have sufficient permissions to add roles to you." });
                                        }
                                    }
                                    else {
                                        message.channel.send({ content: "No trade verified role found, try again when one has been made." });
                                    }
                                });
                                await paguClient.Util.createNewUser(paguClient, message, mojangRes.data.id);
                            }
                            else {
                                embed.addFields({
                                    name: "Failed!",
                                    value: `Your discord and hypixel discord link did not match!`,
                                }, {
                                    name: `Hypixel tag: ${res.data.player.socialMedia.links.DISCORD}`,
                                    value: `Discord tag: ${message.author.tag}`
                                });
                            }
                        }
                        else {
                            embed.addFields({
                                name: "Failed!",
                                value: `Your hypixel account does not have a linked discord! To link your discord go to My profile > Social Media > Discord > Follow the given instructions!`,
                            });
                        }
                        return message.reply({
                            embeds: [embed],
                            allowedMentions: { "users": [] }
                        });
                    });
                }
            });
        }
    }
};
