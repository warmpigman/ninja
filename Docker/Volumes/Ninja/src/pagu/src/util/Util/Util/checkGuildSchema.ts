var paguClient = require('../../../../pagu').Client
type paguClientType = typeof paguClient
module.exports = async function (paguClient:paguClientType, GuildID: String) {
    // Check guild schema exists in mongodb given guildID
    const guildSchema = paguClient.schemas.get("guild")
    type guildSchemaType = typeof guildSchema;
    var returnValue = false
    await guildSchema.findOne({guildID:GuildID}, async (err:Error, data:guildSchemaType) => {
        if(err) throw err
        if(data) {
            returnValue = true
        } else if(!data) {
            returnValue = false
        }
    }).clone()
    return returnValue
}