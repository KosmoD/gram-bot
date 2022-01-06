module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
      try {
  const guildDB = await client.models.Guild.findOne({ guildId: member.guild.id });
      if (!guildDB || !guildDB.plugins.goodbye.enabled) return;
      let channel;
      try {
        channel = await member.guild.channels.fetch(guildDB.plugins.goodbye.channel);
      } catch (e) {
  
      }
      if (!channel) return;
      const content = client.util.formatMessage(guildDB.plugins.goodbye.message, member);
      await channel.send({ content });
      return;
  } catch (err) {}
    }
  };