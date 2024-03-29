import { Schema, model } from "mongoose";
const RoleSubSchema = {
  ID: String,
  Set: {
    type: Boolean,
    default: false,
  },
};
const ChannelSubSchema = {
  ID: String,
  Set: {
    type: Boolean,
    default: false,
  },
};
const guild = new Schema(
  {
    guildID: String,
    swearAllowedChannels: [String],
    spamAllowedChannels: [String],
    swearAllowedCategories: [String],
    spamAllowedCategories: [String],
    scamLinks: [String],
    regularChannel: ChannelSubSchema,
    mainLoggingChannel: ChannelSubSchema,
    nickRequestChannel: ChannelSubSchema,
    reportRequestChannel: ChannelSubSchema,
    scamRequestChannel: ChannelSubSchema,
    notalk: ChannelSubSchema,
    mutedRole: RoleSubSchema,
    tradeBanRole: RoleSubSchema,
    silentVCRole: RoleSubSchema,
    verifiedRole: RoleSubSchema,
    modRole: RoleSubSchema,
    botCommandChannels: {
      Normal: [String],
      skyblockBotCommandChannels: [String],
    },
  },
  {
    minimize: false,
  }
);

module.exports = model("guilds", guild);
