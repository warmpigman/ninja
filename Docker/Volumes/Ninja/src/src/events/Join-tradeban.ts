import { GuildMember } from "discord.js";
module.exports = {
  event: "guildMemberAdd",
  async execute(client: any, paguClient: any, member: GuildMember) {
    const userSchema = await paguClient.schemas.get("user");
    const user = await userSchema.findOne({ discordID: member.id });
    member.guild.roles.fetch().then(async (roles: any) => {
      if (user && user.tradeBanned) {
        let tradeBannedRole = roles.find(
          (r: any) => r.name.toLowerCase() === "trade banned"
        );
        if (tradeBannedRole) {
          await member.roles.add(tradeBannedRole);
        }
      }
    });
  },
};
