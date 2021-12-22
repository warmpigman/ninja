import {Schema, model} from 'mongoose'
const guild = new Schema({
    guildID: String,
    swearAllowedChannels: [String],
    mainLoggingChannel: String,
    swearAllowedCategories: [String],
    spamAllowedCategories: [String],
    nickRequestChannel: String,
    reportRequestChannel: String,
    mutedRole: {
      ID: String,
      Set: Boolean
    },
    tradeBanRole: {
      ID: String,
      Set: Boolean
    },
    silentVCRole: {
      ID: String,
      Set: Boolean
    },
    verifiedRole: {
      ID: String,
      Set: Boolean
    },
    modRole: {
      ID: String,
      Set: Boolean
    },
    botCommandChannels: {
      Normal: [String],
      skyblockBotCommandChannels: [String]
    }
}, {
    minimize: false
});

module.exports = model('guild', guild);