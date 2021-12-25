module.exports = function (options: any, paguClient: any, user: any) {
  paguClient.cache.internal.users.cache.set(user.id, {
    user: user,
    internal: {
      eco: {},
      global: {
        cooldowns: {},
      },
    },
  });
};
