const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("action")
    .setDescription("Perform an action")
    .addStringOption((option) => option.setName("action").setDescription("What would you like to do?").setRequired(true)),
  async execute(interaction) {
    // TODO iterate turn_id at end of if
    const turnCharId = gameStateHandler.whoseTurn();
    if (jsonH.getCharacterOwner(turnCharId) == interaction.user.id) {
      let embed = embedCreator.createActionEmbed(`${turnCharId}`, interaction.options.getString("action"));
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } else {
      let embed = embedCreator.createErrorEmbed("008", "You are unable to do this at this time since it is not your turn. You can still chat regularly but it is important that we give everyone a fair opportunity to play. Try again when it is your turn. =]", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
