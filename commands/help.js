const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));
// const timer = require(path.resolve('./index.js'))

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Help"),
  async execute(interaction) {
    try {
      let embed = embedCreator.createHelpEmbed();
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } catch {
      let embed = embedCreator.createErrorEmbed("004", "There was an error. Please contact a DM as this should not have happened. Thank you!", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
