const fs = require("fs");
const path = require("path");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const gsh = require("./utilities/gamestatehandler.js");
const embedCreator = require(path.resolve("./utilities/embedhandler.js"));
const jsonH = require(path.resolve("./utilities/newjsonhandler.js"));

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

let timer = null;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

const onTimerDing = () => {
  let channel = client.channels.cache.get("DiscordChannelID");
  let embed = embedCreator.createTurnEmbed();
  channel.send({ embeds: [embed.finalEmbed], files: [embed.finalFile] });

  gsh.incrementTurn();
};

const onTimerEarly = () => {
  gsh.incrementTurn();
};

client.on("ready", () => {
  timer = new Timer(function () {
    onTimerDing();
  }, jsonH.getCurrentTimerLength());
});

function getTimeLeft() {
  return Math.ceil((timer._idleStart + timer._idleTimeout - Date.now()) / 1000);
}

const getUserNameFromID = (discordid) => {
  return `${client.users.cache.find(discordid)}`;
};

const resetTimer = (ms) => {
  onTimerEarly();
  timer.reset(ms);
  jsonH.setTimerLength(ms);
};

const getTimerLength = () => {
  return jsonH.getCurrentTimerLength();
};

const stopTimer = () => {
  timer.stop();
};

const startTimer = () => {
  timer.start();
};

function Timer(fn, t) {
  var timerObj = setInterval(fn, t);

  this.stop = function () {
    if (timerObj) {
      clearInterval(timerObj);
      timerObj = null;
    }
    return this;
  };

  // start timer using current settings (if it's not already running)
  this.start = function () {
    if (!timerObj) {
      this.stop();
      timerObj = setInterval(fn, t);
    }
    return this;
  };

  // start with new or original interval, stop current interval
  this.reset = function (newT = t) {
    t = newT;
    return this.stop().start();
  };
}

module.exports = {
  resetTimer: resetTimer,
  stopTimer: stopTimer,
  startTimer: startTimer,
  getTimerLength: getTimerLength,
  getTimeLeft: getTimeLeft,
  getUserNameFromID: getUserNameFromID,
};
