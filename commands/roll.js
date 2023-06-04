const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll some dice!")
    .addNumberOption((option) => option.setName("number").setDescription("How many dice?").setRequired(true))
    .addNumberOption((option) => option.setName("sides").setDescription("How many sided dice?").setRequired(true))
    .addNumberOption((option) => option.setName("modifier").setDescription("Is there a + or - modifier?").setRequired(false)),
  async execute(interaction) {
    const num = interaction.options.getNumber("number");
    const sides = interaction.options.getNumber("sides");
    const modifier = interaction.options.getNumber("modifier") == null ? 0 : interaction.options.getNumber("modifier");
    // let modifier = interaction.options.getNumber('modifier')
    console.log(modifier);
    if (modifier == null) {
      modifier = 0;
    }

    let rollResults = [];

    for (let i = 0; i < num; i++) {
      const baseRoll = Math.floor(Math.random() * sides) + 1;
      const roll = {
        rolled: baseRoll,
        withModifier: baseRoll + modifier,
      };
      rollResults.push(roll);
    }

    let totalRolled = 0;

    rollResults.forEach((roll) => {
      totalRolled += roll.withModifier;
    });

    try {
      let embed = embedCreator.createRollEmbed(rollResults, modifier, totalRolled, interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } catch {
      let embed = embedCreator.createErrorEmbed("009", "Something went wrong with your roll", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
