module.exports = {
    name: ["say"],
    category: "Dev",
    description: "It speaks",
    usage: "say [speech]",
    examples: ["say aaron is a noob"],
    hidden: ["dev"],
    async execute(
      message: any,
      args: Array<string>,
      client: any,
      paguClient: any
    ) {
        if (args[0].length == 0) {
            message.channel.send("What should i say?")
        }
        else {
            message.channel.send(args.join(" "))
        }
    }
}