import * as Path from "path";
import * as fs from "fs";
import * as Chalk from "chalk";
module.exports = function (options: any, paguClient: any) {
  try {
    let path = Path.join(
      process.cwd(),
      options.options.EventDir ?? "dist/src/Events"
    );
    if (!fs.existsSync(path))
      path = Path.join(process.cwd(), "dist/src/events");
    if (!fs.existsSync(path))
      throw 'The "Events" folder could not be found \n Try initalizing the client with a eventDir leading to your Events folder.';
    function registerEvents(path: string) {
      fs.readdirSync(path).forEach((file: string) => {
        if (fs.lstatSync(Path.join(path, file)).isDirectory()) {
          registerEvents(Path.join(path, file));
        } else {
          const eventFile = require(Path.join(path, file));
          var event = "None";
          if (!eventFile.event) {
            return paguClient.Util.log(
              __filename,
              "warn",
              `${file} doesn't contain a event and such will not be registered`
            );
          } else {
            event = eventFile.event;
            paguClient.events.set(file, {
              eventFile: eventFile,
              cache: {
                event: event,
                loaded: true,
                name: file,
                once: eventFile.once ?? false,
              },
            });
            if (eventFile.once) {
              options.client.once(event, (...args: any[]) => {
                eventFile.execute(options.client, paguClient, ...args);
              });
            } else {
              options.client.on(event, (...args: any[]) => {
                eventFile.execute(options.client, paguClient, ...args);
              });
            }
          }
        }
      });
    }
    //, registerEvents(Path.join(process.cwd(), "/dist/pagu/events"))
    Promise.all([registerEvents(path)]);

    var events = new Array();
    paguClient.events.forEach((Event: any) => {
      let name = Chalk.yellowBright(
        Path.basename(Event.cache.name, Path.extname(Event.cache.name))
      );
      if (Event.eventFile.name) {
        if (Event.eventFile.name[0]) {
          name = Chalk.cyanBright(Event.eventFile.name[0]);
        }
      }
      events.push({
        name: name,
        loaded: Event.cache.loaded,
      });
    });
    console.table(
      events.reduce((acc: any, { name, ...x }) => {
        acc[name] = x;
        return acc;
      }, {})
    );
  } catch (e) {
    paguClient.Util.log(__filename, "error", e, true);
  }
};
