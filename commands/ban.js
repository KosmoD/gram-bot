const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban the member.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("who to kick")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("tell reason")
        ),
    });
  }

  async execute(interaction) {
    try {
      const banMember = interaction.options.getMember("member");
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";
      if (!interaction.guild)
        return interaction.reply("This command only works in servers");
      if (!interaction.member.permissions.has("BAN_MEMBERS"))
        return interaction.reply(
          "**You Don't Have The Permission To Ban Users!**"
        );
      if (!interaction.guild.me.permissions.has("BAN_MEMBERS"))
        return interaction.reply(
          "**I Don't Have The Permission To Ban Users!**"
        );
      if (!banMember) return interaction.reply("**User Is Not In The Server**");
      if (banMember === interaction.member)
        return interaction.reply("**You Cannot Ban Yourself!**");
      if (!banMember.bannable)
        return interaction.reply("**Cannot Ban That User!**");

      interaction.guild.bans
        .create(banMember.id, {
          days: 0,
          reason: reason.length !== 0 ? reason : "No Reason Provided",
        })
        .then(() => {
          const banEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor(
              banMember.user.username,
              banMember.user.displayAvatarURL({
                dynamic: true,
              })
            )
            .setDescription(
              `
                **Hello, You Have Been Banned From ${interaction.guild.name}
                ${reason.length !== 0 ? `\n\`Reason\` - ${reason}` : ""}**`
            )
            .setFooter(
              interaction.guild.name,
              interaction.guild.iconURL({
                dynamic: true,
              })
            )
            .setTimestamp();
          banMember
            .send({
              embeds: [banEmbed],
            })
            .catch(() => null);
        })
        .catch(() => {
          return interaction.reply(`Couldn't Ban ${banMember}`);
        });

      const confirmEmbed = new MessageEmbed().setColor("GREEN").setAuthor(
        interaction.guild.name,
        interaction.guild.iconURL({
          dynamic: true,
        })
      ).setDescription(`
                **${banMember.user.username} Has Been Banned
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