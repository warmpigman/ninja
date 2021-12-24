import {Schema, model} from 'mongoose'
const ModActionSchema = new Schema({
    set: Boolean,
    permanent: Boolean,
    until: Date
})
const user = new Schema({
    discordID: String,
    mojangUUID: String,
    afk: {
        reason: String,
        afk: Boolean
    },
    ban: ModActionSchema,
    mute: ModActionSchema,
}, {
    minimize: false
});

module.exports = model('users', user);