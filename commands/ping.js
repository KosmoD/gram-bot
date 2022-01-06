const {
    MessageEmbed
} = require("discord.js");
const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Replies with pong"),
        });
    }
    async execute(interaction) {
        interaction.deferReply();
        try {
            const sent = await interaction.followUp({
                content: "Pinging...",
                fetchReply: true,
            });
            interaction.editReply(
                `Roundtrip latency: ${
          sent.createdTimestamp - interaction.createdTimestamp
        }ms`
            );
        } catch (error) {
            console.log(error)

        }
    }
};