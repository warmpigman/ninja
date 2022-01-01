var Util = require("../handlers/util");
import { EventEmitter } from "events";
import * as Discord from "discord.js";
var cacheGuildHandler = require("../handlers/Cache/guild");
var cacheUserHandler = require("../handlers/Cache/user");
var mongoose = require("mongoose");
const redis = require('redis')
/**
 * Pagu
 * @extends {EventEmitter}
 */
class Pagu extends EventEmitter {
  Util: any;
  commands: any;
  events: any;
  categories: any;
  cache: any;
  schemas: any;
  options: any;
  Discord: any;
  redisClient: any;
  /**
   * @param {paguOtopions} options Options for this, client is required.
   */
  constructor(options: any) {
    super();
    this.Discord = require("discord.js");
    this.options = options;

    /**
     * Utility provided by the client
     * @type {Util}
     */
    this.Util = Util;
    /**
     * The commands handled by the client
     * @type {Discord.Collection}
     * @private
     */
    this.commands = new Discord.Collection();
    /**
     * The events handled by the client
     * @type {Discord.Collection}
     * @private
     */
    this.events = new Discord.Collection();
    /**
     * The command cattegories handled by the client
     * @type {Discord.Collection}
     * @private
     */
    this.categories = new Discord.Collection();
    /**
     * The cache handler provided by the client
     * @type {Discord.Collection}
     */
    this.cache = new Discord.Collection();
    this.cache.internal = new Discord.Collection();
    /**
     * The internal guild cache handler
     * @type {cacheGuildHandler}
     */
    this.cache.internal.guilds = new cacheGuildHandler();
    this.cache.internal.guilds.cache = new Discord.Collection();
    /**
     * The internal user cache handler
     * @type {cacheUserHandler}
     */
    this.cache.internal.users = new cacheUserHandler();
    this.cache.internal.users.cache = new Discord.Collection();
    /**
     * The internal cooldown cache
     * @type {Discord.Collection()}
     */
    this.cache.internal.cooldowns = new Discord.Collection();
    //need to add stuff below
    //need to add stuff below
    //need to add stuff below
    //need to add stuff below
    //need to add stuff below
    /**
     * The internal per server cooldown cache handler
     * @type {cacheGuildHandler}
     */
    this.cache.internal.cooldowns.servers = new Discord.Collection();
    /**
     * The internal global cooldown cache handler
     * @type {cacheGuildHandler}
     */
    this.cache.internal.cooldowns.global = new Discord.Collection();
    /**
     * The schema handler provided by the client
     * @type {cacheGuildHandler}
     */
    this.schemas = new Discord.Collection();
    /**
     * The internal schema handler provided by the client
     * @type {cacheGuildHandler}
     */
    this.schemas.internal = new Discord.Collection();
    (async () => {
      if (!options)
        throw "You need to initialize the client with options. ( new <pagu>.Client() )";
      if (!options.options)
        throw "You need to initialize the client with options. ( new <pagu>.Client({options: {}}) )";
      if (!options.client)
        throw "You need to initialize the client with a discord.js client";
      Promise.all([
        (async () => {
          try {
            mongoose.connection
              .on("connected", () => {
                Util.log(__filename, "log", "Connected to the Mongo Database!");
              })
              .on("disconnected", () => {
                Util.log(
                  __filename,
                  "error",
                  "The Mongo Database was disconnected!",
                  true
                );
              });
            await mongoose.connect(options.options.mongoURI, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              // useFindAndModify: false
            });
          } catch (e) {
            Util.log(
              __filename,
              "error",
              "There was an error connecting to the Mongo Database!"
            );
            Util.log(__filename, "error", e, true);
          }
        })(),
        (async () => {
          try {
            this.redisClient = redis.createClient({
              url: options.options.redisURI,
              retry_strategy: function (Options: any) {
                if (Options.error && Options.error.code === "ECONNREFUSED") {
                  // End reconnecting on a specific error and flush all commands with a individual error
                  return new Error("The Redis Database was disconnected!");
                }
                if (Options.total_retry_time > 1000 * 60 * 60) {
                  // End reconnecting after a specific timeout and flush all commands with a individual error
                  return new Error(
                    "Retry time exhausted. The Redis Database was disconnected!"
                  );
                }
                if (Options.attempt > 10) {
                  // End reconnecting with built in error
                  return undefined;
                }
                // reconnect after
                return Math.min(Options.attempt * 100, 3000);
              }
            });
            this.redisClient.on("ready", () => {
              Util.log(__filename, "log", "Connected to the Redis Database!");
            });
            this.redisClient.on("error", (err: Error) => {
              Util.log(
                __filename,
                "error",
                "An error occured with the Redis Database!"
              );
              Util.log(__filename, "error", err, true);
            });
            await this.redisClient.connect()
          } catch (e) {
            Util.log(
              __filename,
              "error",
              "There was an error connecting to the Redis Database!"
            );
            Util.log(__filename, "error", e, true);
          }
        })(),
        Util.registerSchemas(options, this),
        Util.registerCache(options, this),
        Util.addCommands(options, this),
        Util.addEvents(options, this),
      ]);
    })();
  }
}
module.exports = Pagu;
