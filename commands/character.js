const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));
const embedHandler = require(path.resolve("./utilities/embedhandler.js"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Use character")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create character")
        .addStringOption((option) => option.setName("characterid").setDescription("The DnD Beyond character ID").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update character to match DnD Beyond")
        .addStringOption((option) => option.setName("characterid").setDescription("The DnD Beyond character ID").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stats")
        .setDescription("List character stats")
        .addStringOption((option) => option.setName("characterid").setDescription("The DnD Beyond character ID").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Show character info")
        .addStringOption((option) => option.setName("characterid").setDescription("The DnD Beyond character ID").setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("List all current characters and IDs"))
    .addSubcommand((subcommand) => subcommand.setName("mine").setDescription("List characters and IDs that belong to you"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a character")
        .addStringOption((option) => option.setName("characterid").setDescription("DnD Beyond ID").setRequired(true))
    ),
  async execute(interaction) {
    try {
      if (interaction.options.getSubcommand() === "create") {
        const downloadID = interaction.options.getString("characterid");

        if (downloadID === null) {
          console.log("downloadID was null");
        } else {
          console.log(`Download ID = ${downloadID}`);
          jsonH.createNewCharacter(downloadID, `${interaction.user.id}`, interaction);
        }
      } else if (interaction.options.getSubcommand() == "remove") {
        jsonH.removeCharacter(`${interaction.options.getString("characterid")}`, interaction);
      } else if (interaction.options.getSubcommand() === "update") {
        const downloadID = interaction.options.getString("characterid");

        if (downloadID == null) {
          console.log("downloadID was null");
        } else {
          console.log(`Download ID = ${downloadID}`);
          jsonH.updateCharacter(downloadID, interaction);
        }
      } else if (interaction.options.getSubcommand() === "list") {
        let charArray = jsonH.getCharacterNamesAndIds();

        let replyString = "";

        for (let x = 0; x < charArray.length; x++) {
          const charsBetweenFields = 10;
          let idLen = charArray[x].id.length;
          replyString += `${charArray[x].id}:`;
          for (let y = idLen; y < charsBetweenFields; y++) {
            replyString += "-";
          }
          replyString += `${charArray[x].name}`;
          replyString += "\n";
        }

        await interaction.reply("```" + replyString + "```");
      } else if (interaction.options.getSubcommand() === "mine") {
        let charArray = jsonH.getCharacterNamesAndIds();

        let myArray = [];
        let replyString = "";

        charArray.forEach((character) => {
          if (jsonH.getCharacterOwner(character.id) === interaction.user.id) {
            myArray.push(character);
          }
        });

        for (let x = 0; x < myArray.length; x++) {
          const charsBetweenFields = 10;
          let idLen = myArray[x].id.length;
          replyString += `${myArray[x].id}:`;
          for (let y = idLen; y < charsBetweenFields; y++) {
            replyString += "-";
          }
          replyString += `${myArray[x].name}`;
          replyString += "\n";
        }

        await interaction.reply("```" + replyString + "```");
      } else if (interaction.options.getSubcommand() == "stats") {
        let embed = embedHandler.createStatEmbed(`${interaction.options.getString("characterid")}`);
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
      } else if (interaction.options.getSubcommand() == "info") {
        let embed = embedHandler.createInfoEmbed(`${interaction.options.getString("characterid")}`);
        await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile] });
      }
    } catch (e) {
      // let embed = embedHandler.createErrorEmbed('006', 'There was an error. Please contact a DM as this should not have happened. Thank you!', interaction)
      console.log(e);
      let embed = embedHandler.createErrorEmbed("006", e, interaction);
      await interaction.reply({ embeds: [embed.finalEmbed], files: [embed.finalFile], ephemeral: true });
    }
  },
};
