const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const {
    MessageEmbed
} = require("discord.js");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName("nick-name")
                .setDescription("change nickname of a user")
                .addUserOption((option) =>
                    option
                    .setName("target")
                    .setDescription("select target")
                    .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                    .setName("nickname")
                    .setDescription("type your nickname here")
                    .setRequired(true)
                ),
        });
    }

    async execute(interaction) {

        const target = interaction.options.getMember("target");
        const nick = interaction.options.getString("nickname");

        const nickbed = new MessageEmbed()
            .setColor("NOT_QUITE_BLACK")
            .setTitle(`Nickname changed!!\nNickname: ${nick}`);

        interaction.reply({
            embeds: [nickbed]
        });
        interaction.followUp('✅')
        target.setNickname(nick)
    }
}