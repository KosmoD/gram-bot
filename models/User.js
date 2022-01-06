const mongoose = require("mongoose");
module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        wallet: {
          type: Number,
          default: 400,
        },
        level: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
          default: "New bie",
        },
    }),
);