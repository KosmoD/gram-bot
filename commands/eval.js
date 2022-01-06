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
                .setName("eval")
                .setDescription("Eval JS Code")
                .addStringOption(option => option.setName("code").setDescription("code").setRequired(true)),
            requirements: {
                ownerOnly: true
            },
        });
    }
    async execute(interaction, {
        guildDB
    }) {
        await interaction.deferReply();
        const {
            inspect
        } = require("util");
        const {
            client
        } = interaction;
        const content = interaction.options.getString("code");
        const embed = new MessageEmbed().addField(
            "**Input**",
            "```js\n" + content + "\n```"
        );
        const result = new Promise((resolve) => resolve(eval(content)));
        const clean = (text) => {
            if (typeof text === "string") {
                if (text.includes(client.token)) {
                    //Client token
                    text = text.replace(client.token, "T0K3N");
                }
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            } else {
                return text;
            }
        };

        return result
            .then((output) => {
                const type = typeof output;
                if (typeof output !== "string") {
                    output = inspect(output, {
                        depth: 0
                    }); //depth should be 0 as it will give contents of object in a property, in this object. That makes the message too long.
                }

                interaction.followUp({
                    embeds: [
                        embed
                        .setDescription("```js\n" + clean(output) + "\n```")
                        .addField("**Type**", type),
                    ],
                });
            })
            .catch((err) => {
                if (typeof err !== "string") {
                    err = inspect(err, {
                        depth: 0
                    });
                }

                interaction.followUp({
                    embeds: [
                        embed.setDescription(
                            "ERROR:\n```js\n" + clean(err) + "\n```"
                        ),
                    ],
                });
            });
    }
};