const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("advertise")
        .setDescription("advertise your server in our server."),       
        cooldown: 2 * 60 * 60 * 60,
    });
  }

  async execute(interaction) {
            await interaction.deferReply();
    
    const  invite = await (interaction.guild.channels.cache.get(interaction.guild?.systemChannelId) || interaction.guild.channels.cache.find(c => c.type === "GUILD_TEXT")).createInvite({
           maxAge: 0,
           maxUses: 0
         },
      )
      .catch(console.log);   
        await interaction.followUp("Sent!");

 
  

    const sendchannel =
      interaction.client.channels.cache.get("912294171308617748");
    if (sendchannel)
      return sendchannel.send(`Server Link: ${invite}`);
  }
};