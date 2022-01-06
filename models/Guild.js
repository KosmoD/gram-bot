const mongoose = require("mongoose");
module.exports = mongoose.model(
    "Guild",
    new mongoose.Schema({
        guildId: {
            type: String,
            required: true,
            unique: true,
        },
        plugins: {
            welcome: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                channel: {
                    type: String,
                    default: "0",
                },
                message: {
                    type: String,
                    default: "Welcome /mention/",
                },
            },
            goodbye: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                channel: {
                    type: String,
                    default: "0",
                },
                message: {
                    type: String,
                    default: "Goodbye /mention/. We are sad to see u go :sob:",
                },
            },
        },
    }),
);