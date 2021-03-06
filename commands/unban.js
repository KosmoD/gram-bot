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
                .setName("unban")
                .setDescription("unban the member.")
                .addUserOption((option) =>
                    option
                    .setName("member")
                    .setDescription("who to unban")
                    .setRequired(true)
                ),
        });
    }

    async execute(interaction) {
        try {
            const userID = interaction.options.getUser("member");
            let bannedMember;
            if (!interaction.guild)
                return interaction.reply("This command only works in servers");
            if (!interaction.member.permissions.has("BAN_MEMBERS"))
                return interaction.reply(
                    "**You Don't Have The Permission To Unban Users!**"
                );
            if (!interaction.guild.me.permissions.has("BAN_MEMBERS"))
                return interaction.reply(
                    "**I Don't Have The Permission To Unban Users!**"
                );

            try {
                bannedMember = await interaction.guild.bans.fetch(userID);
            } catch {
                return interaction.reply(
                    "**Please Provide A Valid User Or ID Or The User Is Not Banned!**"
                );
            }

            try {
                await interaction.guild.bans.remove(bannedMember.user.id);
            } catch {
                return interaction.reply(`Couldn't Unban ${bannedMember}`);
            }

            const banEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(
                    bannedMember.user.username,
                    bannedMember.user.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .setDescription(
                    `**${bannedMember.user.tag} Has Been Unbanned From ${interaction.guild.name}**`
                )
                .setFooter(
                    interaction.guild.name,
                    interaction.guild.iconURL({
                        dynamic: true,
                    })
                )
                .setTimestamp();
            return interaction.reply({
                embeds: [banEmbed],
            });
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        }
    }
};