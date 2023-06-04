const fs = require("fs");
const path = require("path");

const getCharacterNames = () => {
  const dirPath = path.resolve(`./charactersheets/parsed/`);
  let files = fs.readdirSync(dirPath);
  let nameArr = [];
  files.forEach((file) => {
    nameArr.push(file.split(".")[0]);
  });
  return nameArr;
};

module.exports = {
  getCharacterNames: getCharacterNames,
};
