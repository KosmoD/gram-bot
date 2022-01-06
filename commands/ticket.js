const {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');
const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName("ticket-setup")
                .setDescription("🎫 setup ticket system for your server")
                
        });
    }

    async execute(interaction, message) {
        
        if (!interaction.member.permissions.has("MANAGE_MESSAGES"))
        return interaction.reply(
          "**You Don't Have The Permission To Use This Cmd! (users with MANAGE MESSAGE PERMISSION can use it.)**"
        );
        
        
        
      const embed = new MessageEmbed()
            .setColor('0x36393E')
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
            .setDescription('To create a ticket click on the button. <:tickets:915929232457211954> ')
            .setTitle('Tickets Counter!!')


        const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('tic')
                .setLabel('🎫 Create Ticket!')
                .setStyle('SUCCESS'),
            );

        interaction.reply({
            embeds: [embed],
            components: [bt]
        });
    }
}