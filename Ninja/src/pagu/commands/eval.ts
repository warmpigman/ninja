module.exports = {
    name: ["eval", "evaluate"],
    category: "Dev",
    description: "Evaluation command for developers",
    usage: "eval [code]",
    examples: [
        "eval 1+1",
        "eval paguClient.options.client.on('message', message => {\nif(message.author.id==\"300669365563424770\")\n{ message.delete() }})",
        "eval paguClient.options.client.on('message', message => {\nif(message.author.id==\"738857742474805370\")\n{ message.react(\"❤️\") })})"
    ],
    hidden: ["dev"],
    async execute(message: any, args:Array<string>, client:any, paguClient:any) {
        if(paguClient.options.options.devs.includes(message.author.id)) {
            try{
                const clean = (text:string) => {
                    if (typeof(text) === "string")
                      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                    else
                        return text;
                  }
                  
                const code = args.join(" ");
                var embed = new paguClient.Discord.MessageEmbed()
                embed.setFooter(message.author.tag + ' | ' + paguClient.options.client.user.username, message.author.displayAvatarURL({dynamic: true}));
                embed.setColor("#0e8499")
                .setTimestamp()
                if(!args[0]) {
                    embed.setTitle('Eval - Syntax Error')
                    embed.setDescription('Please enter something to eval!')
                } else{
                try {
                let evaled = await eval(code);
                embed.setTitle('Eval - Success')
                embed.setDescription(`\`\`\`xl\n${clean(evaled)}\n\`\`\``);
                }catch(e:any){
                    paguClient.Util.log(__filename, "error", e, false)
                    embed.setTitle('Eval - Error')
                    embed.setDescription(`\`\`\`xl\n${clean(e.toString())}\n\`\`\``);
                }
            }
            message.channel.send({embeds: [embed]})
        }catch(e) {
                paguClient.Util.log(__filename, "error", e, true)
            }
        }
    }
}