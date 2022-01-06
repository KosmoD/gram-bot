const moment = require("moment");
const warnModel = require("../structures/warns");
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
                .setName("warnings")
                .setDescription("show the warning of a user.")
                .addUserOption((option) =>
                    option
                    .setName("target")
                    .setDescription("select target")
                    .setRequired(true)
                ),
        });
    }

    async execute(interaction) {
        await interaction.deferReply();
        try {
            await interaction.members.fetch();
        } catch (e) {}

        const user = interaction.options.getUser("target");
        if (!user) return interaction.reply("User not found.");
        const userWarnings = await warnModel.find({
            userId: user.id,
            guildId: interaction.guildId,
        });

        if (!userWarnings?.length)
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`${user.tag} has no warnings in this server!`)
                    .setColor('0x36393E')
                ],
            });

        const embedDescription = userWarnings
            .map((warn) => {
                const moderator = interaction.guild.members.cache.get(warn.moderatorId);

                return [
                    `WarnId: ${warn.warnId}`,
                    `Moderator: ${moderator || "Has Left"}`,
                    `Date: ${moment(new Date(warn.timestamp)).format("MMMM Do YYYY")}`,
                    `Reason: ${warn.reason}`,
                ].join("\n");
            })
            .join("\n\n");

        const embed = new MessageEmbed()
            .setTitle(`${user.tag}'s warnings `)
            .setDescription(embedDescription)
            .setColor("0x36393E");

        await interaction.followUp({
            embeds: [embed]
        });
    }
};