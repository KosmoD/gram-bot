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
                .setName("user-info")
                .setDescription("info about user")
                .addUserOption((option) =>
                    option
                    .setName("target")
                    .setDescription("select user")
                    .setRequired(false)
                ),
        });
    }

    async execute(interaction) {
        const target = interaction.options.getMember("target") || interaction.member;
        await target.user.fetch();

        const response = new MessageEmbed()
            .setColor(target.user.accentColor || "0x36393E")
            .setAuthor(target.user.tag, target.user.avatarURL({
                dynamic: true
            }))
            .setThumbnail(target.user.avatarURL({
                dynamic: true
            }))
            .setImage(target.user.bannerURL({
                dynamic: true,
                size: 512
            }) || "")
            .addFields({
                name: "ID",
                value: target.user.id
            }, {
                name: "Joined Server",
                value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
                inline: true
            }, {
                name: "Account Created",
                value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
                inline: true
            }, {
                name: "Roles",
                value: target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"
            }, {
                name: "Accent Colour",
                value: target.user.accentColor ? `#${target.user.accentColor.toString(16)}` : "None"
            }, {
                name: "Banner",
                value: target.user.bannerURL() ? "** **" : "None"
            });

        interaction.reply({
            embeds: [response],
            ephemeral: true
        })
    }
}