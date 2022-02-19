import { GuildMember } from "discord.js";
module.exports = {
  event: "guildMemberUpdate",
  async execute(
    client: any,
    paguClient: any,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    const badWordsSchema = await paguClient.schemas.get("badWords");
    const badWords = await badWordsSchema.find();
    const validNicks = [
      "Morgan",
      "Finley",
      "Riley",
      "Jessie",
      "Jaime",
      "Kendall",
      "Skyler",
      "Frankie",
      "Quinn",
      "Harley",
      "Peyton",
      "Robbie",
      "Sidney",
      "Tommie",
      "Ashley",
      "Carter",
      "Adrian",
      "Clarke",
      "Jackie",
      "Logan",
      "Mickey",
      "Nicky",
      "Parker",
      "Mick",
      "Tyler",
    ];
    if (
      badWords.some((word: { word: String }) =>
        newMember.nickname?.toLowerCase().includes(word.word.toLowerCase())
      )
    ) {
      newMember.setNickname(validNicks[Math.random() * validNicks.length]);
    }
  },
};
