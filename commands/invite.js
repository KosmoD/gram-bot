const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');
const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName("invite")
                .setDescription("create server invite")

        });
    }

    async execute(interaction) {
        await interaction.deferReply();
        const invite = await (interaction.guild.channels.cache.get(interaction.guild ?.systemChannelId) || interaction.guild.channels.cache.find(c => c.type === "GUILD_TEXT")).createInvite({
                    maxAge: 0,
                    maxUses: 0
                },
                `Requested with command by ${interaction.user.tag}`
            )
            .catch(console.log);
        interaction.followUp(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.");
    }
};