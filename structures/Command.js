const {
    Collection
} = require("discord.js");
module.exports = class Command {
    constructor(client, options = {}) {
        this.client = client;
        this.data = options.data;
        this.requirements = options.requirements || {
            ownerOnly: false
        };
        this.cooldown = options.cooldown || 5;
    }

    async execute(interaction) {
        throw new Error(`Command ${this.name} doesn't provide a execute method!`);
    }

    checkCooldown(interaction) {
        const {
            user: author
        } = interaction;
        const {
            cooldowns
        } = this.client;

        if (!cooldowns.has(this.name)) {
            cooldowns.set(this.name, new Collection());
        }

        const now = Date.now(); //number of milliseconds elapsed since January 1, 1970 00:00:00 UTC. Example: 1625731103509
        const timestamps = cooldowns.get(this.name);
        const cooldownAmount = (this.cooldown || 5) * 1000;

        if (timestamps.has(author.id)) {
            const expirationTime = timestamps.get(author.id) + cooldownAmount;

            if (now < expirationTime) {
                //Still this cooldown didn't expire.
                const timeLeft = (expirationTime - now) / 1000;
                interaction.reply(
                    `Woah, slowdown buddy. Wait for ${timeLeft.toFixed()} seconds before using the ${
            this.data.name
          } command again`
                );
                return false;
            }
        }

        return this.applyCooldown(author, cooldownAmount);
    }

    applyCooldown(author, cooldownAmount) {
        const timestamps = this.client.cooldowns.get(this.name);
        timestamps.set(author.id, Date.now());
        setTimeout(() => timestamps.delete(author.id), cooldownAmount); //Delete cooldown for author after cooldownAmount is over.
        return true;
    }

    removeCooldown(author) {
        const timestamps = this.client.cooldowns.get(this.name);
        timestamps.delete(author.id);
        return true;
    }
};