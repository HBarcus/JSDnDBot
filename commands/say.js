const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));

function addChoiceCharacterNames(dataObject, characterNameList) {
  for (let i = 0; i < characterNameList.length; i++) {
    dataObject.addChoice(`${characterNameList[i]}`, `to_${characterNameList[i]}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something out loud to noone in particular")
    .addStringOption((option) => option.setName("phrase").setDescription("What would you like to say?").setRequired(true)),
  async execute(interaction) {
    const turnCharId = gameStateHandler.whoseTurn();
    if (jsonH.getCharacterOwner(turnCharId) == interaction.user.id) {
      let embed = embedCreator.createSayEmbed(`${turnCharId}`, interaction.options.getString("phrase"));
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } else {
      let embed = embedCreator.createErrorEmbed("002", "You are unable to do this at this time since it is not your turn. You can still chat regularly but it is important that we give everyone a fair opportunity to play. Try again when it is your turn. =]", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
