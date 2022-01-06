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
                .setName("kick")
                .setDescription("🔨 kick the member.")
                .addUserOption((option) =>
                    option
                    .setName("member")
                    .setDescription("who to kick")
                    .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                    .setName("reason")
                    .setDescription("why do you want to kick user")
                ),
        });
    }

    async execute(interaction) {
        try {
            if (!interaction.guild)
                return interaction.reply("This command only works in servers");
            if (!interaction.member.permissions.has("KICK_MEMBERS"))
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("You Don't Have The Permission To Kick Users!")
                        .setColor('0x36393E')
                    ],
                });

            if (!interaction.guild.me.permissions.has("KICK_MEMBERS"))
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("I Don't Have The Permission To Kick Users!")
                        .setColor('0x36393E')
                    ],
                });

            const kickMember = interaction.options.getMember("member");
            const reason =
                interaction.options.getString("reason") || "No Reason Provided";

            if (!kickMember)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('User Is Not In The Server!')
                        .setColor('0x36393E')
                    ],
                });

            if (kickMember === interaction.member)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('You cannot kick yourself!')
                        .setColor('0x36393E')
                    ],
                });

            if (!kickMember.kickable)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Cannot Kick That User!')
                        .setColor('0x36393E')
                    ],
                });

            kickMember
                .kick(reason.length !== 0 ? reason : "No Reason Provided")
                .then(() => {
                    const kickEmbed = new MessageEmbed()
                        .setColor("0x36393E")
                        .setAuthor(
                            kickMember.user.username,
                            kickMember.user.displayAvatarURL({
                                dynamic: true,
                            })
                        )
                        .setDescription(
                            `
                **You Have Been Kicked From ${interaction.guild.name}
                ${reason.length !== 0 ? `\n\`Reason\` - ${reason}` : ""}**`
                        )
                        .setFooter(
                            interaction.guild.name,
                            interaction.guild.iconURL({
                                dynamic: true,
                            })
                        )
                        .setTimestamp();
                    kickMember
                        .send({
                            embeds: [kickEmbed],
                        })
                        .catch(() => null);
                })
                .catch(() => {
                    return interaction.reply(`Couldn't Kick ${kickMember}`);
                });

            const confirmEmbed = new MessageEmbed().setColor("0x36393E").setAuthor(
                interaction.guild.name,
                interaction.guild.iconURL({
                    dynamic: true,
                })
            ).setDescription(`
                **${
                  kickMember.user.username
                } Has Been Kicked from this server!
                ${
                  reason.length !== 0
                    ? `\n\`Reason\` - ${reason}`
                    : "\n`Reason` - No Reason Provided"
                }**`);

            return interaction.reply({
                embeds: [confirmEmbed],
            });
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        }
    }
};