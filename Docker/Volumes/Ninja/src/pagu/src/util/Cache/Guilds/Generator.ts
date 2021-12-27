module.exports = function (options: any, paguClient: any, guild: any) {
  paguClient.cache.internal.guilds.cache.set(guild.id, {
    guild: guild,
    internal: {
      eco: {},
      cooldowns: {},
    },
  });
};
