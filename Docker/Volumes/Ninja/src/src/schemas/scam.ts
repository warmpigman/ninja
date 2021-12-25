import { Schema, model } from "mongoose";
const scam = new Schema(
  {
    website: String,
  },
  {
    minimize: false,
  }
);

module.exports = model("scam", scam);
