const fs = require("fs");
require("dotenv").config();
const {
  Client,
  Intents,
  Collection
} = require("discord.js");
const mongoose = require("mongoose");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

// Creating a collection for commands in client
client.commands = new Collection();
client.cooldowns = new Collection();
client.models = require("./models");
client.config = require("./config");
client.util = {
  formatMessage: (msg, member) => msg.replaceAll("/mention/", `${member}`).replaceAll("/server/", `${member.guild.name}`),
};

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  console.log(`Loading ${file}`);
  const cmd = require(`./commands/${file}`);
  const command = new cmd(client);
  //console.log(command);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

process.on("unhandledRejection", (error) => {
  console.log(error);
});

const MONGO_URL = process.env["mongooseConnectionString"];

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to mongodb"));

client.login(process.env.DISCORD_TOKEN);