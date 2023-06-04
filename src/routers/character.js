const express = require("express");
const router = new express.Router();
const path = require("path");

const discordBotDir = path.join(require("os").homedir(), "/environment/discordbot");
const jsonH = require(path.join(discordBotDir, "/utilities", "/newjsonhandler"));
const gsh = require(path.join(discordBotDir, "/utilities", "/gamestatehandler"));

router.get("/listcharacters", (req, res) => {
  res.render("listcharacters", {
    title: "Character List",
  });
});

router.get("/character/:id", (req, res) => {
  let charid = req.params["id"];
  if (jsonH.doesCharacterExist(charid)) {
    let charJson = jsonH.getParsedCharacterJson(charid);
    res.render("character", {
      title: "Character Info",
      characterName: `${jsonH.getCharacterName(charid)}`,
      classInfo: `${jsonH.getAllClasses(charid)}`,
      race: `${charJson.race}`,
      ideals: `${charJson.ideals}`,
      bonds: `${charJson.bonds}`,
      flaws: `${charJson.flaws}`,
      backgroundTitle: `${charJson.personality.background.title}`,
      backgroundDesc: `${charJson.personality.background.description}`,
      languageArr: `${charJson.languages}`,
    });
  } else {
    res.render("error", {
      title: "Error",
      errorDetail: `Character ID ${charid} does not exist`,
      // TODO: Change URL to domain/search
      redirectURL: "http://domain.com/search",
    });
  }
});

router.get("/characterinfo/:id", (req, res) => {
  let charid = req.params["id"];
  let charJson = jsonH.getParsedCharacterJson(charid);
  let character = {
    title: "Character Info",
    characterName: `${jsonH.getCharacterName(charid)}`,
    classInfo: jsonH.getAllClasses(charid),
    alignment: `${charJson.alignment}`,
    race: `${charJson.race}`,
    ideals: `${charJson.ideals}`,
    bonds: `${charJson.bonds}`,
    flaws: `${charJson.flaws}`,
    backgroundTitle: `${charJson.personality.background.title}`,
    backgroundDesc: `${charJson.personality.background.description}`,
    languageArr: charJson.languages,
    avatarURL: `${charJson.avatarURL}`,
    abilityInfo: jsonH.getAllAbilities(charid),
    ownerShortName: jsonH.getCharacterOwnerShortName(charid),
    ownerFullName: jsonH.getCharacterOwnerFullName(charid),
  };
  res.send(character);
});

router.get("/characterlist", (req, res) => {
  const characters = [];
  const jsonNamesandIds = jsonH.getCharacterNamesAndIds();
  jsonNamesandIds.forEach((character) => {
    let charJson = jsonH.getParsedCharacterJson(character.id);
    let classes = [];
    classes = jsonH.getAllClasses(character.id);
    const newChar = {
      id: `${character.id}`,
      name: `${character.name}`,
      owner: `${jsonH.getCharacterOwner(character.id)}`,
      checkedin: `${gsh.isCharacterCheckedIn(character.id)}`,
      classInfo: classes,
      race: `${charJson.race}`,
      ideals: `${charJson.ideals}`,
      bonds: `${charJson.bonds}`,
      flaws: `${charJson.flaws}`,
      backgroundTitle: `${charJson.personality.background.title}`,
      backgroundDesc: `${charJson.personality.background.description}`,
      languageArr: `${charJson.languages}`,
      ownerName: `${charJson.ownerFull}`,
    };
    characters.push(newChar);
  });
  characters.sort((a, b) => (a.checkedin == true ? 1 : -1));
  res.send(characters);
});

router.post("/charactersearch", (req, res) => {
  res.send("Character search");
});

module.exports = router;
