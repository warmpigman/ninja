"use strict";
module.exports = function (paguClient, message, uuid) {
    var userSchema = paguClient.schemas.get('user');
    userSchema.findOne({
        discordID: message.author.id
    }, (err, data) => {
        if (err)
            throw err;
        else {
            if (data) {
                userSchema.findOneAndUpdate({
                    discordID: message.author.id
                }, {
                    mojangUUID: uuid
                });
            }
            else if (!data) {
                data = new userSchema({
                    discordID: message.author.id,
                    mojangUUID: uuid,
                }).save();
            }
        }
    });
};
