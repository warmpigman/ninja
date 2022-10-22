import { Message } from "discord.js";

module.exports = {
    event: "messageUpdate",
    async execute(client: any, paguClient: any, oldMessage: Message, newMessage: Message) {
    const guildSchema = await paguClient.schemas.get("guild");
    const badWordsSchema = await paguClient.schemas.get("badWords");
    const guildData = await guildSchema.findOne({
      guildID: newMessage?.guild?.id,
    });
    const badWords = await badWordsSchema.find();
    if (guildData && badWords) {
      if (newMessage.channel.id !== guildData.regularChannel.id) {
        if (
          badWords
            .filter(
              (word: { word: String; severity: String }) =>
                word.severity.toLowerCase() == "vb"
            )
            .map((word: { word: String; severity: String }) =>
              word.word.toLowerCase()
            )
            .some((word: String) =>
            newMessage.content.toLowerCase().includes(word.toString())
            )
        ) {
          newMessage.delete();
          newMessage.channel.send(
            `${newMessage.author.tag} has sent a very bad message. :angry:`
          );
        }
      } else if (
        badWords
          .filter(
            (word: { word: String; severity: String }) =>
              word.severity.toLowerCase() == "mb"
          )
          .map((word: { word: String; severity: String }) =>
            word.word.toLowerCase()
          )
          .some((word: String) =>
          newMessage.content.toLowerCase().includes(word.toString())
          )
      ) {
        newMessage.delete();
        newMessage.channel.send(
          `${newMessage.author.tag} has sent a possibly bad message. :angry:`
        );
      }
    }
    }
}