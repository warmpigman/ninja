"use strict";
module.exports = async function (paguClient, message, uuid, afk) {
    var userSchema = await paguClient.schemas.get('user');
    userSchema.findOne({
        discordID: message.author.id
    }, async (err, data) => {
        if (err)
            throw err;
        else {
            if (data) {
                await userSchema.findOneAndUpdate({
                    discordID: message.author.id
                }, {
                    mojangUUID: uuid ?? data.mojangUUID,
                    afk: {
                        reason: afk?.reason ?? data.afk.reason,
                        afk: afk?.afk ?? data.afk.afk
                    }
                });
            }
            else if (!data) {
                data = new userSchema({
                    discordID: message.author.id,
                    mojangUUID: uuid,
                    afk: {
                        reason: afk?.reason ?? "Not Afk",
                        afk: afk?.afk ?? false
                    },
                }).save();
            }
        }
    });
};
