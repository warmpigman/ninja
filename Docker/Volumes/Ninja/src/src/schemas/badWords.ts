import { Schema, model } from "mongoose";
const badWord = new Schema(
  {
    word: String,
    Severity: String
  },
  {
    minimize: false,
  }
);

module.exports = model("badWord", badWord);
