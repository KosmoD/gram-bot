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
                .setName("warn")
                .setDescription("warn the member.")
                .addUserOption((option) =>
                    option
                    .setName("target")
                    .setDescription("who to warn")
                    .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                    .setName("reason")
                    .setDescription("why do you want to warn user")
                ),
        });
    }

    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.guild)
            return interaction.followUp("This command only works in servers");
        if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
            return interaction.followUp(
                "**You Don't Have The Permission To Warn Users!**"
            );
        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES"))
            return interaction.followUp(
                "**I Don't Have The Permission To Warn Users!**"
            );

        const user = interaction.options.getMember("target");
        const reason =
            interaction.options.getString("reason") || "No Reason Provided";

        if (!user) return interaction.followUp("**User Is Not In The Server**");
        if (user === interaction.member)
            return interaction.followUp("**You Cannot warn Yourself!**");
        if (!user.kickable)
            return interaction.followUp("**Cannot Warn That User!**");
        const checks = {
            dmEd: false,
            logged: false
        };
        try {
            const warn = new warnModel({
                warnId: Math.round(Math.random() * 1e10),
                userId: user.id,
                guildId: interaction.guildId,
                moderatorId: interaction.user.id,
                reason,
                timestamp: new Date().toISOString(),
            });
            await warn.save();
            checks.logged = true;
        } catch (e) {
            checks.logged = false;
        }
        try {
            await user.send(`You have been warned in ${interaction.guild.name} for ${reason}`);
            checks.dmEd = true;
        } catch (e) {
            checks.dmEd = false;
        }
        const getEmoji = (boolean) => boolean ? " :white_check_mark:" : ":x";
        const embed = new MessageEmbed()
            .setTitle('User has been warned!')
            .setColor('0x36393E')
            .addField("Checks", `> DM the user? ${checks.dmEd}\n> Warning logged: ${checks.logged}`);
        await interaction.followUp({
            embeds: [embed]
        });
    }
};