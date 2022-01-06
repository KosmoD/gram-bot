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
                .setName("server-info")
                .setDescription("info about the server"),
        });
    }

    async execute(interaction) {
        await interaction.deferReply();

        const guild = interaction.guild

        const owner = await interaction.guild.fetchOwner();
        let guildDescription = guild.description
        if (!guildDescription) {
            guildDescription = 'None'
        }

        const embed = new MessageEmbed()
            .setTitle('serverinfo')
            .setDescription('Returns information about the server.')
            .addFields({
                name: 'Name',
                value: guild.name,
                inline: true
            }, {
                name: 'ID',
                value: guild.id,
                inline: true
            }, {
                name: 'Description',
                value: guildDescription,
                inline: true
            }, {
                name: 'Created at',
                value: guild.createdAt.toDateString(),
                inline: true
            }, {
                name: 'Owner',
                value: owner.user.tag,
                inline: true
            }, {
                name: 'Member Count',
                value: guild.memberCount.toString(),
                inline: true
            }, {
                name: 'Member Cap',
                value: guild.maximumMembers.toString(),
                inline: true
            }, {
                name: 'Boosts',
                value: guild.premiumSubscriptionCount.toString(),
                inline: true
            }, {
                name: 'Boost Level',
                value: guild.premiumTier,
                inline: true
            })
        interaction.followUp({
            embeds: [embed]
        });

    }
};