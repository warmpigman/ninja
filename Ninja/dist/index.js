"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Discord = require("discord.js");
var Pagu = require("./pagu/pagu");
const Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, "GUILD_MESSAGES"] });
Client.on('ready', async () => {
    const PaguClient = await new Pagu.Client({
        client: Client, options: {
            prefix: process.env.PREFIX,
            mongoURI: process.env.MONGODB_URI,
            schemaDir: "/dist/src/schemas",
            devs: [
                "406920919131488268"
            ],
            niceCategory: {
                dev: "<:dev:865771194531184661> Dev",
                utility: ":gear: Utility",
                none: ":question: None",
                eco: "<:eco:866070829270564886> Economy"
            },
            niceCommands: {
                test: "Test",
                eval: "Eval",
                help: "Help",
                ping: "Ping",
                bal: "Bal"
            }
        }
    });
});
Client.login(process.env.TOKEN);
