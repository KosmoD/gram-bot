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
                .setName("embed")
                .setDescription("an embed message")               
            .addStringOption((option) =>
                    option.setName("title").setDescription("set title").setRequired(true)
                )            
                .addStringOption((option) =>
                    option.setName("message").setDescription("add message to embed").setRequired(true)
                ),
             
        });
    }

    async execute(interaction, message) {
        interaction.deferReply()
        try {        
            
                     
                      
            const message = interaction.options.getString('message');
            const title = interaction.options.getString('title');
            
            const exampleEmbed = new MessageEmbed()
            .setColor('0x36393E')
            .setTitle(`${title}`)            
            .setAuthor(
                interaction.user.tag,
                interaction.user.displayAvatarURL({
                dynamic: true,
              }))
            .setDescription(`${message}`)                     
            .setTimestamp()
            .setFooter(
                interaction.guild.name,
              interaction.guild.iconURL({
                dynamic: true,
              }))    
            interaction.followUp({ embeds: [exampleEmbed] })
                   
        } catch (error) {
            console.log(error)
            
        };


    }
};