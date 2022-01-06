const {
    REST
} = require("@discordjs/rest");
const {
    Routes
} = require("discord-api-types/v9");
const TOKEN = process.env["DISCORD_TOKEN"];
module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        const commands = client.commands.map((cmd) => cmd.data.toJSON());
        const TEST_GUILD_ID = process.env["TEST_GUILD_ID"];
        const CLIENT_ID = client.user.id;
        const rest = new REST({
            version: "9",
        }).setToken(TOKEN);
        (async () => {
            try {
                if (!TEST_GUILD_ID) {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands,
                    });
                    console.log("Successfully registered application commands globally");
                } else {
                    await rest.put(
                        Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                            body: commands,
                        }
                    );
                    console.log(
                        "Successfully registered application commands for development guild"
                    );
                }
            } catch (error) {
                if (error) console.error(error);
            }
        })();
        client.user.setPresence({
            activities: [{
                name: "with Cuppy"
            }],
            status: "online",
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
