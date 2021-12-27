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
    mainLoggingChannel: ChannelSubSchema,
    nickRequestChannel: ChannelSubSchema,
    reportRequestChannel: ChannelSubSchema,
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

module.exports = model("guild", guild);
