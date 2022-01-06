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
                .setName('welcome')
                .setDescription('Manage settings for welcome logs')
                .addChannelOption(option => option.setName('channel').setDescription('set welcome channel'))
                .addStringOption(option => option.setName('message').setDescription('set welcome message'))
                .addBooleanOption(option => option.setName('enabled').setDescription('disable or enable welcome logs')),
        });
    }

    async execute(interaction, { guildDB }) {
        await interaction.deferReply();
        let currentChannel;
        try {
            currentChannel = await interaction.guild.channels.fetch(guildDB.plugins.welcome.channel);
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
                "**You Don't Have The Permission To Change/View Welcome settings!**"
            );
        if (channel) {
            guildDB.plugins.welcome.channel = channel.id;
        }
        if (message) {
            guildDB.plugins.welcome.message = message;
        }
        if (enabled !== null) guildDB.plugins.welcome.enabled = !!enabled;
        if (enabled && !currentChannel && !channel) {
            return await interaction.followUp("You have to first set the welcome channel before enabling welcome plugin");
        }
        if (channel || message || enabled !== null) {
            await guildDB.save();
            return await interaction.followUp("Welcome settings updated!");
        }
        const embed = new MessageEmbed()
            .setTitle("Current settings for welcome logs")
            .setDescription("These are the current Welcome logs settings of this Server.\nUse `/welcome [subcommand]` to change them.")
            .addField("Channel", `${currentChannel ?? "Not set"}`)
            .addField("Message", "```" + `${guildDB.plugins.welcome.message}` + "```")
            .addField("Preview", `${interaction.client.util.formatMessage(guildDB.plugins.welcome.message, interaction.member)}`)
            .addField("Enabled", guildDB.plugins.welcome.enabled ? "True" : "False");
        await interaction.followUp({ embeds: [embed] });
    }
}