const MuteList = require("../structures/MuteList");
const { formatTime } = require("../structures/functions");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("unmute the member.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("who to unmute")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has("MANAGE_GUILD"))
        return interaction.reply(
          "**You Dont Have Permmissions To Unmute Someone!**"
        );
      if (!interaction.guild.me.permissions.has("MANAGE_GUILD"))
        return interaction.reply(
          "**I Don't Have Permissions To Unmute Someone!**"
        );

      const muteMember = interaction.options.getMember("member");
      if (!muteMember)
        return interaction.reply("**User Is Not In The Server**");
      if (muteMember === interaction.member)
        return interaction.reply("**You Cannot Mute Yourself!**");

      let muterole = interaction.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "muted"
      );
      if (!muteMember.roles.cache.has(muterole.id))
        return interaction.reply("**User Is Not Muted!**");

      const muteMemberFetched = await MuteList.findOne({
        ID: muteMember.user.id,
      });
      if (muteMember.roles.cache.has(muterole.id) && !muteMemberFetched) {
        muteMember.roles.remove(muterole);

        const confirmEmbed = new MessageEmbed()
          .setColor("GREEN")
          .setAuthor(
            interaction.guild.name,
            interaction.guild.iconURL({
              dynamic: true,
            })
          )
          .setDescription(`**${muteMember.user.username} Has Been Unmuted!**`)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({
          embeds: [confirmEmbed],
        });
      } else {
        muteMember.roles
          .remove(muterole)
          .then(async () => {
            for (const roleID of muteMemberFetched.roles) {
              let role = interaction.guild.roles.cache.get(roleID);
              muteMember.roles.add(role);
            }
            await MuteList.deleteOne({
              ID: muteMember.user.id,
            });

            const unmuteEmbed = new MessageEmbed()
              .setColor("GREEN")
              .setAuthor(
                muteMember.user.username,
                muteMember.user.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setDescription(
                `
                    **Hello, You Have Been Unmuted In ${interaction.guild.name}
                    ${
                      muteMemberFetched.time !== 0
                        ? `\n\`Time\` - ${formatTime(muteMemberFetched.time)}`
                        : ""
                    }**`
              )
              .setFooter(
                interaction.guild.name,
                interaction.guild.iconURL({
                  dynamic: true,
                })
              )
              .setTimestamp();
            muteMember
              .send({
                embed: unmuteEmbed,
              })
              .catch(() => null);
          })
          .catch(() => {
            return interaction.reply(`Couldn't Unmute ${muteMember}`);
          });

        const confirmEmbed = new MessageEmbed().setColor("GREEN").setAuthor(
          interaction.guild.name,
          interaction.guild.iconURL({
            dynamic: true,
          })
        ).setDescription(`
                    **${muteMember.user.username} Has Been Unmuted
                    ${
                      muteMemberFetched.time !== 0
                        ? `\n\`Time\` - ${formatTime(muteMemberFetched.time)}`
                        : ""
                    }
                    \`Reason\` - ${muteMemberFetched.reason}**`);
        interaction.reply({
          embeds: [confirmEmbed],
        });

        const logEmbed = new MessageEmbed()
          .setAuthor(
            interaction.guild.name,
            interaction.guild.iconURL({
              dynamic: true,
            })
          )
          .setColor("RED")
          .setTitle(`Prisoner - ${muteMemberFetched.tag} Unmuted`)
          .addFields(
            {
              name: "Name",
              value: muteMember.user.username,
              inline: true,
            },
            {
              name: "Penalty Duration",
              value: `${
                muteMemberFetched.time !== 0
                  ? formatTime(muteMemberFetched.time)
                  : "Permanent"
              }`,
              inline: true,
            },
            {
              name: "Moderator",
              value: interaction.user.username,
              inline: true,
            },
            {
              name: "Reason",
              value: muteMemberFetched.reason,
            }
          )
          .setFooter(
            `Prisoner Bulletin`,
            muteMember.user.displayAvatarURL({
              dynamic: true,
            })
          )
          .setTimestamp();

        const logEmbedChannel =
          interaction.guild.channels.cache.get("875934553800343612");
        if (logEmbedChannel)
          return logEmbedChannel.send({
            embeds: [logEmbed],
          });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
    }
  }
};