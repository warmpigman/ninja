import {Schema, model} from 'mongoose'
const user = new Schema({
    discordID: String,
    mojangUUID: String,
    afk: {
        reason: String,
        afk: Boolean
    },
    ban: {
        set: Boolean,
        permanent: Boolean,
        until: Date
    },
    mute: {
        set: Boolean,
        permanent: Boolean,
        unti: Date,
    },
}, {
    minimize: false
});

module.exports = model('users', user);