const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Permissions
} = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        console.log(`${interaction.user.tag} triggered an interaction!!`);
        if (interaction.isButton() && interaction.customId === "tic") {
            try {
                if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS"))
                    return interaction.reply({
                        content: 'No permission to create  channel! (Please tell admins)',
                        ephemeral: true
                    });
            } catch (err) {}
            const existingChan = interaction.guild.channels.cache.find(c => c.topic === `${interaction.user.id}`);
            if (existingChan) {
                return await interaction.reply({
                    content: `You already have a ticket created (${existingChan}), close that to open a new one`,
                    ephemeral: true
                })
            }
            const perms = [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES];
            const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                type: 'GUILD_TEXT',
                topic: `${interaction.user.id}`,
                permissionOverwrites: [{
                        id: interaction.guild.roles.everyone.id,
                        deny: perms,
                    },
                    {
                        id: interaction.user.id,
                        allow: perms,
                    },
                    {
                        id: interaction.client.user.id,
                        allow: perms,
                    },
                ],
            });
            await interaction.reply({
                content: `Created ticket: ${channel}`,
                ephemeral: true
            });

            const embed = new MessageEmbed()
                .setTitle('Ticket Created!')
                .setDescription('Hello there,\n The staff will be here as soon as possible mean while tell us about your issue!\nThank You!')
                .setColor('GREEN')
                .setTimestamp()
                .setAuthor(interaction.guild.name, interaction.guild.iconURL({
                    dynamic: true
                }));
            const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('del')
                    .setLabel('🗑️ Delete Ticket!')
                    .setStyle('DANGER'),
                );
            channel.send({
                content: `Welcome <@${interaction.user.id}>`,
                embeds: [embed],
                components: [del]
            });
        } else if (interaction.isButton() && interaction.customId === 'del') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('delConfirm')
                    .setLabel('Delete')
                    .setStyle('DANGER'),
                    new MessageButton()
                    .setCustomId('delCancel')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY'),
                );
            interaction.reply({
                content: `Are you sure you want to delete this ticket?`,
                components: [row]
            });
        } else if (interaction.isButton() && interaction.customId === 'delConfirm') {
            const channel = interaction.channel;
            channel.delete();
        } else if (interaction.isButton() && interaction.customId === 'delCancel') {
            await interaction.channel.bulkDelete(1);
            const msg = await interaction.channel.send("Deletion Cancelled");
            setTimeout(() => msg.delete(), 5 * 60);
        }
        if (interaction.isCommand()) {
            if (!interaction.guild) return;
            const command = client.commands.get(interaction.commandName);
            if (!command || !command.checkCooldown(interaction)) return;
            if (command.requirements.ownerOnly && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                content: "Only the developers can use this command",
                epehermal: true
            });
            let guildDB = await client.models.Guild.findOne({
                guildId: interaction.guild.id
            });


            if (!interaction.guild)
                return interaction.followUp("This command only works in servers");

            if (!guildDB) {
                guildDB = new client.models.Guild({
                    guildId: interaction.guild.id
                });
                await guildDB.save();
            }
            try {
                await command.execute(interaction, {
                    guildDB
                });
            } catch (error) {
                if (error) console.log(error);
                const embed = {
                    title: "There was an error while executing this command!",
                    description: "Try again after a minute or ask in the support server!",
                    fields: [],
                };
                if (client.config.owners.includes(interaction.user.id)) {
                    embed.fields.push({
                        name: "Error",
                        value: `${error.stack}`
                    });
                }
                try {
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                } catch (e) {
                    await interaction.followUp({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }
            }
        }

    }

};