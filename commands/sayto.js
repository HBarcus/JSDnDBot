const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));

function addChoiceCharacterNames(dataObject, characterNameList) {
  for (let i = 0; i < characterNameList.length; i++) {
    dataObject.addChoice(`${characterNameList[i]}`, `to_${characterNameList[i]}`);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sayto")
    .setDescription("Say something on your turn!")
    .addStringOption((option) => option.setName("phrase").setDescription("What would you like to say?").setRequired(true))
    .addStringOption((option) => option.setName("target").setDescription("Who are you speaking to").setRequired(true)),
  async execute(interaction) {
    const turnCharId = gameStateHandler.whoseTurn();
    console.log(turnCharId);
    if (jsonH.getCharacterOwner(turnCharId) == interaction.user.id) {
      let embed = embedCreator.createSayToEmbed(`${turnCharId}`, interaction.options.getString("phrase"), interaction.options.getString("target"));
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } else {
      let embed = embedCreator.createErrorEmbed("001", "You are unable to do this at this time since it is not your turn. You can still chat regularly but it is important that we give everyone a fair opportunity to play. Try again when it is your turn. =]", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
    // To make message visible only to sender:
    // interaction.reply({ content: 'Only you! :)', ephemeral: true });

    // TODO add ephemeral error
  },
};
