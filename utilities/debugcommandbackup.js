const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));

const modIDs = ["xyz", "xyz", "xyz"];

// fix comment
module.exports = {
  data: new SlashCommandBuilder().setName("debug").setDescription("Debug Command"),
  async execute(interaction) {
    const user = interaction.user.id;
    if (modIDs.includes(`${user}`)) {
      jsonH.createNewJson("45160711");
      await interaction.reply("Debugged");
    } else {
      await interaction.reply("You are not an admin. Please contact a DM to perform this action.");
    }
  },
};
