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
                .setName("remove-warn")
                .setDescription("remove the warn of member.")
                .addStringOption((option) =>
                    option.setName("id").setDescription("warn id").setRequired(true)
                ),
        });
    }

    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.guild)
            return interaction.editReply("This command only works in servers");
        if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
            return interaction.editReply(
                "**You Don't Have The Permission To Warn Users!**"
            );
        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES"))
            return interaction.editReply(
                "**I Don't Have The Permission To Warn Users!**"
            );

        const warnId = interaction.options.getString("id");
        const data = await warnModel.findOne({
            warnId
        });

        if (!data)
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`${warnId} is not a valid ID\nType: /warnings to see all warnings of user and get ID.`)
                    .setColor('0x36393E')
                ],
            });

        data.delete();

        const user = interaction.guild.members.cache.get(data.userId);
        return interaction.editReply({
            embeds: [
                new MessageEmbed()
                .setTitle(`Removed 1 warning of ${user.user.tag}`)
                .setColor('0x36393E')
            ],
        });
    }
};