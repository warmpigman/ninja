import {Message, Client, MessageEmbed, User} from "discord.js"

module.exports = {
    name: ["coinflip", "cf"],
    category: "Fun",
    description: "Flips a coin",
    usage: "coinflip",
    examples: [
        "coinflip",
        "cf"
    ],
    async execute(message:Message, args:Array<string>, client:Client, paguClient:any) {
        let index = Math.floor(Math.random() * 2)
        const choices = ["Heads", "Tails"]
        message.channel.send(`The coin landed on ${choices[index]}`)
    }
}