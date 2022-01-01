var redis = require("redis");
var paguClient = require("../../../../pagu").Client;
type paguType = typeof paguClient;
module.exports = async function (key: string, paguClient: paguType) {
  var data = await paguClient.redisClient.get(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
};
