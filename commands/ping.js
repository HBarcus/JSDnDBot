const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(interaction) {
    try {
      await interaction.reply("Pong!");
    } catch {
      let embed = embedCreator.createErrorEmbed("003", "There was an error. Please contact a DM as this should not have happened. Thank you!", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
