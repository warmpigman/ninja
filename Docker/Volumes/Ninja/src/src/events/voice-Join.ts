import { VoiceState } from "discord.js";
module.exports = {
  event: "voiceStateUpdate",
  async execute(
    client: any,
    paguClient: any,
    oldState: VoiceState,
    newState: VoiceState
  ) {
    newState.member.guild.roles.fetch().then(async (roles: any) => {
      const silentVcRole = roles.find(
        (r: any) => r.name.toLowerCase() === "silent vc"
      );
      if (newState.channel === null) {
        await newState.member.roles.remove(silentVcRole);
      } else if (oldState.channel === null) {
        await newState.member.roles.add(silentVcRole);
      }
    });
  },
};
