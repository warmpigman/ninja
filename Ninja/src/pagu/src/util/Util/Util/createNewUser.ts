module.exports = function (paguClient: any, message: any, uuid: String) {
    var userSchema = paguClient.schemas.get('user')
    userSchema.findOne({
        discordID: message.author.id
    }, (err: Error, data: any) => {
        if(err) throw err;
        else { 
            if(data) {
                userSchema.findOneAndUpdate({
                    discordID: message.author.id
                },{
                    mojangUUID: uuid
                })
            } else if(!data) {
                data = new userSchema({
                    discordID: message.author.id,
                    mojangUUID: uuid,
                }).save()
            }
        }
    })
}