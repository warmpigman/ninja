var redis = require("redis");
var paguClient = require("../../../../pagu").Client;
type ClientType = typeof paguClient;
interface data {
  key: string;
  data: any;
}

module.exports = async function (data: data, paguClient: ClientType) {
    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key:any, value:any) => {
          if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };
  await paguClient.redisClient.set(
    data.key,
    JSON.stringify(data.data, replacerFunc()),
    "EX",
    60 * 5
  );
  return;
};
