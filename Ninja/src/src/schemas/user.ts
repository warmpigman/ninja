import {Schema, model} from 'mongoose'
const user = new Schema({
    discordID: String,
    mojangUUID: String,
    afk: {
        reason: String,
        afk: Boolean
    },
}, {
    minimize: false
});

module.exports = model('users', user);