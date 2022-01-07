import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
module.exports = {
  name: ["test"],
  slashInit() {
    return new SlashCommandBuilder().setName("test").setDescription("test");
  },
  category: "Dev",
  description: "test",
  usage: "test",
  examples: ["test"],
  hidden: ["dev"],
  async execute(interaction: CommandInteraction, client: any, paguClient: any) {
    interaction.reply("yoe");
  },
};
