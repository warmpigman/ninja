import {Schema, model} from 'mongoose'
const user = new Schema({
    discordID: String,
    mojangUUID: String
}, {
    minimize: false
});

module.exports = model('users', user);