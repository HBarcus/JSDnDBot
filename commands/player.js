const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const gameStateHandler = require(path.resolve("../discordbot/utilities/gamestatehandler"));
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));
const playerCheckInPath = path.resolve("./utilities/datajsons/playerCheckInList.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("player")
    .setDescription("Check in, check out, you know... whatever.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("checkin")
        .setDescription("Check in to the game")
        .addStringOption((option) => option.setName("charid").setDescription("Character ID to check in").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("checkout")
        .setDescription("Check out of the game")
        .addStringOption((option) => option.setName("charid").setDescription("Character ID to check in").setRequired(true))
    ),
  async execute(interaction) {
    // TODO iterate turn_id at end of if
    // const turnCharId = gameStateHandler.whoseTurn()
    if (interaction.options.getSubcommand() == "checkin" && jsonH.getCharacterOwner(`${interaction.options.getString("charid")}`) === interaction.user.id) {
      console.log("checked in used");
      let rawCheckin = fs.readFileSync(playerCheckInPath);
      let checkinJSON = JSON.parse(rawCheckin);
      if (checkinJSON["checkedin"].includes(`${interaction.options.getString("charid")}`)) {
        console.log("Player already checked in");
        let embed = embedCreator.createActionEmbed(`${interaction.options.getString("charid")}`, "Already checked in");
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
      } else {
        checkinJSON["checkedin"].push(interaction.options.getString("charid"));
        let stringify = JSON.stringify(checkinJSON);
        fs.writeFileSync(playerCheckInPath, stringify);
        console.log("Player added");
        let embed = embedCreator.createActionEmbed(`${interaction.options.getString("charid")}`, "Checked in");
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
      }
      // let embed = embedCreator.createActionEmbed(`${turnCharId}`, interaction.options.getString('action'));
      // await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
    } else if (interaction.options.getSubcommand() == "checkout" && jsonH.getCharacterOwner(`${interaction.options.getString("charid")}`) == interaction.user.id) {
      console.log("checked out used");
      let rawCheckin = fs.readFileSync(playerCheckInPath);
      let checkinJSON = JSON.parse(rawCheckin);
      if (checkinJSON["checkedin"].includes(`${interaction.options.getString("charid")}`)) {
        console.log("logged player out");
        let index = checkinJSON["checkedin"].indexOf(`${interaction.options.getString("charid")}`);
        if (index > -1) {
          checkinJSON["checkedin"].splice(index, 1);
        }
        let stringify = JSON.stringify(checkinJSON);
        fs.writeFileSync(playerCheckInPath, stringify);
        let embed = embedCreator.createActionEmbed(`${interaction.options.getString("charid")}`, "Checked out");
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
      } else {
        let embed = embedCreator.createActionEmbed(`${interaction.options.getString("charid")}`, "Already checked out");
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
      }
    } else {
      let embed = embedCreator.createErrorEmbed("008", "You are unable to do this at this time since it is not your turn. You can still chat regularly but it is important that we give everyone a fair opportunity to play. Try again when it is your turn. =]", interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
