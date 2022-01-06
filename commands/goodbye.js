const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js');
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('goodbye')
                .setDescription('Manage settings for goodbye logs')
                .addChannelOption(option => option.setName('channel').setDescription('set goodbye channel'))
                .addStringOption(option => option.setName('message').setDescription('set goodbye message'))
                .addBooleanOption(option => option.setName('enabled').setDescription('disable or enable goodbye logs')),
        });
    }

    async execute(interaction, {
        guildDB
    }) {
        await interaction.deferReply();
        let currentChannel;
        try {
            currentChannel = await interaction.guild.channels.fetch(guildDB.plugins.goodbye.channel);
        } catch (e) {
            currentChannel = null;
        }
        const channel = interaction.options.getChannel("channel") ?? null;
        const message = interaction.options.getString("message") ?? null;
        const enabled = interaction.options.getBoolean("enabled") ?? null;

        if (!interaction.guild.me.permissions.has("ADMINISTRATOR"))
            return interaction.followUp(
                "**I Don't Have The Admin Permissions!**"
            );
        if (!interaction.guild)
            return interaction.followUp("This command only works in servers");
        if (!interaction.member.permissions.has("MANAGE_GUILD"))
            return interaction.followUp(
                "**You Don't Have The Permission To Change/View Goodbye settings!**"
            );
        if (channel) {
            guildDB.plugins.goodbye.channel = channel.id;
        }
        if (message) {
            guildDB.plugins.goodbye.message = message;
        }
        if (enabled !== null) guildDB.plugins.goodbye.enabled = !!enabled;
        if (enabled && !currentChannel && !channel) {
            return await interaction.followUp("You have to first set the goodbye channel before enabling goodbye plugin");
        }
        if (channel || message || enabled !== null) {
            await guildDB.save();
            return await interaction.followUp("Goodbye settings updated!");
        }
        const embed = new MessageEmbed()
            .setTitle("Current settings for goodbye logs")
            .setDescription("These are the current GoodBye logs settings of this Server.\nUse `/goodbye [subcommand]` to change them.")
            .addField("Channel", `${currentChannel ?? "Not set"}`)
            .addField("Message", "```" + `${guildDB.plugins.goodbye.message}` + "```")
            .addField("Preview", `${interaction.client.util.formatMessage(guildDB.plugins.goodbye.message, interaction.member)}`)
            .addField("Enabled", guildDB.plugins.goodbye.enabled ? "True" : "False");
        await interaction.followUp({
            embeds: [embed]
        });
    }
}