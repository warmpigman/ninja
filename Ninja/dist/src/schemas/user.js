"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user = new mongoose_1.Schema({
    discordID: String,
    mojangUUID: String
}, {
    minimize: false
});
module.exports = (0, mongoose_1.model)('users', user);
