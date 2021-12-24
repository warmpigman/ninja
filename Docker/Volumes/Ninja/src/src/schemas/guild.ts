import { Schema, model } from 'mongoose'
const RoleSubSchema = {
  ID: String,
  Set: {
    type: Boolean,
    default: false
  }
}
const ChannelSubSchema = {
  ID: String,
  Set: {
    type: Boolean,
    default: false
  }
}
const guild = new Schema({
  guildID: String,
  swearAllowedChannels: [String], // not needed
  mainLoggingChannel: ChannelSubSchema, // needed
  swearAllowedCategories: [String], // not needed
  spamAllowedCategories: [String], // not needed
  nickRequestChannel: ChannelSubSchema, // not needed
  reportRequestChannel: ChannelSubSchema, // not needed
  mutedRole: RoleSubSchema, // not needed
  tradeBanRole: RoleSubSchema, // not needed
  silentVCRole: RoleSubSchema, // not needed
  verifiedRole: RoleSubSchema, // not needed
  modRole: RoleSubSchema, // not needed
  botCommandChannels: {
    Normal: [String],
    skyblockBotCommandChannels: [String]
  }
}, {
  minimize: false
});

module.exports = model('guild', guild);