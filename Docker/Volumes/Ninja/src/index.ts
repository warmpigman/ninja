require("dotenv").config();
import * as Discord from "discord.js";
var Pagu = require("./pagu/pagu");
const Client = new Discord.Client({ intents: new Discord.Intents(32767) });
Client.on("ready", async () => {
  const PaguClient = await new Pagu.Client({
    client: Client,
    options: {
      prefix: process.env.PREFIX,
      mongoURI: process.env.MONGODB_URI,
      redisURI: process.env.REDIS_URI,
      schemaDir: "/dist/src/schemas",
      devs: [
        // "300669365563424770",
        "406920919131488268",
      ],
      devServers: ["802395497881010196"],
      niceCategory: {
        dev: "<:dev:865771194531184661> Dev",
        utility: ":gear: Utility",
        none: ":question: None",
        eco: "<:eco:866070829270564886> Economy",
        image: "🖼️ Image",
      },
      niceCommands: {
        test: "Test",
        eval: "Eval",
        help: "Help",
        ping: "Ping",
        bal: "Bal",
      },
    },
  });
});
process
  .on("unhandledRejection", (reason, p) => {
    console.log("error", reason, p);
  })
  .on("uncaughtException", (err, origin) => {
    console.log("error", err, origin);
  })
  .on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("error", err, origin);
  });
// Commenting this because I am too bad coder and don't understand promises sooo...
/*
.on("multipleResolves", (type, promise, reason) => {
  console.log("resolve", type, promise, reason);
});*/
Client.login(process.env.TOKEN);
