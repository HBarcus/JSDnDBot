const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const config = require(path.resolve("./config.json"));
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Perform admin command")
    .addSubcommand((subcommand) => subcommand.setName("resetdata").setDescription("Reset character data (No backup made)"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("changetimerlength")
        .setDescription("use this to reset the timer")
        .addNumberOption((option) => option.setName("ms").setDescription("The number of milliseconds to set the timer to").setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName("pausegame").setDescription("Pause the game"))
    .addSubcommand((subcommand) => subcommand.setName("startgame").setDescription("Start the game"))
    .addSubcommand((subcommand) => subcommand.setName("gettimerremaining").setDescription("Get the time remaining in the current turn")),
  async execute(interaction) {
    if (config.modIDs.includes(`${interaction.user.id}`)) {
      if (interaction.options.getSubcommand() === "resetdata") {
        jsonH.resetCharacterData();
        await interaction.reply({ content: "Character data reset.", ephemeral: true });
      } else if (interaction.options.getSubcommand() == "changetimerlength") {
        const timer = require(path.resolve("./index.js"));
        timer.resetTimer(interaction.options.getNumber("ms"));
        await interaction.reply({ content: "Timer reset.", ephemeral: true });
      } else if (interaction.options.getSubcommand() == "pausegame") {
        const timer = require(path.resolve("./index.js"));
        timer.stopTimer();
        await interaction.reply({ content: "Game paused.", ephemeral: true });
      } else if (interaction.options.getSubcommand() == "startgame") {
        const timer = require(path.resolve("./index.js"));
        timer.startTimer();
        await interaction.reply({ content: "Game started.", ephemeral: true });
      } else if (interaction.options.getSubcommand() == "gettimerremaining") {
        const timer = require(path.resolve("./index.js"));
        const timeRemaining = timer.getTimeLeft();
        await interaction.reply({ content: `There are ${timeRemaining} seconds left on the timer`, ephemeral: true });
      } else {
        await interaction.reply("No valid subcommand was given.");
      }
    } else {
      let embed = embedCreator.createErrorEmbed("007", "You have to be a DM to do this. We can't just let people go around erasing everyone's data. If you want to remove your character you can use '/character remove' Also, yes, this error code was made 007 on purpose.", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
