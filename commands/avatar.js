const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get the avatar URL of the selected user or your avatar.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user's avatar to show")
            .setRequired(false)
        ),
    });
  }

  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user ;
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(`0x36393E`)
          .setTitle(`${user.username}'s Avatar`)
          .setImage(user.displayAvatarURL({
                dynamic: true,
                size: 1024
            }))
          .setFooter(`Requested by ${interaction.user.tag}`),
      ],
    });
  }
};