// import { SlashCommandBuilder } from "@discordjs/builders";
// import { CommandInteraction } from "discord.js";
// module.exports = {
//   name: ["test"],
//   slashInit() {
//     return new SlashCommandBuilder().setName("test").setDescription("test");
//   },
//   category: "Dev",
//   description: "test",
//   usage: "test",
//   examples: ["test"],
//   hidden: ["dev"],
//   async execute(interaction: CommandInteraction, client: any, paguClient: any) {
//     const guildSchema = await paguClient.schemas.get("guild");
//             // @ts-ignore
//     console.log(interaction.guild.id)
//     await guildSchema.findOne(
//         {
//             // @ts-ignore
//             "guildID": "802395497881010196"
//             // regularChannel: {
//             //     Set: false
//             // }
//         },
//         (err: Error, data: any) => {
//             console.log(data, 54);
//             if (err) {
//                 console.log(err);
//                 return interaction.reply({
//                     content: `An error has occured, please try again later.`,
//                 });
//             }
//         })
//     interaction.reply("yoe");
//   },
// };
