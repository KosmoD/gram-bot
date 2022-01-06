const moongoose = require("mongoose");

module.exports = moongoose.model(
    "warnings",
    new moongoose.Schema({
        userId: String,
        warnId: String,
        guildId: String,
        moderatorId: String,
        reason: String,
        timestamp: String,
    })
);