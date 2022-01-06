const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../structures/Command");
module.exports = class CMD extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Tells you a fortune.")
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("ask your question")
            .setRequired(true)
        ),
    });
  }

  async execute(interaction) {
    const question = interaction.options.getString("question"),
      fortunes = [
        "Hell no.",
        "Probably not.",
        "I am busy with your mom, ask later.",
        "i think its yes.",
        "Hell yeah my dude.",
        "It is certain.",
        "It is no dummy.",
        "Without a Doubt.",
        "Yes - Definitaly.",
        "NO means no.",
        "As i see it, Yes.",
        "Most Likely.",
        "Bruh its 100% a no.",
        "Yes!",
        "No!",
        "Signs a point to Yes!",
        "Try Later.",
        "IDK but its stupid question just like you.",
        "Better not tell you know.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't Count on it.",
        "My reply is No.",
        "My sources say No.",
        "hahahahah its NO.",
        "Very Doubtful",
      ];

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(`0x36393E`)
          .setTitle(`Question: ${question}?`)
          .setDescription(
            fortunes[Math.floor(Math.random() * fortunes.length)]
          ),
      ],
    });
  }
};