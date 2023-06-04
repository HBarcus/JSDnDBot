const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const config = require(path.resolve("./config.json"));
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));
// const timer = require(path.resolve('./index.js'))

module.exports = {
  data: new SlashCommandBuilder().setName("finish").setDescription("Finish"),
  async execute(interaction) {
    if (jsonH.getCharacterOwner(gameStateHandler.whoseTurn()) == interaction.user.id || config.modIDs.includes(`${interaction.user.id}`)) {
      console.log(path.resolve("./index.js"));
      const timer = require(path.resolve("./index.js"));
      // timer.resetTimer(timer.getTimerLength())
      gameStateHandler.incrementTurn();
      let embed = embedCreator.createTurnEmbed();
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } else {
      let embed = embedCreator.createErrorEmbed("005", "You're not allowed to end other players' turns early. Nice try though ;]", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
    // ephemeral error
  },
};
