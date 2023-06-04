const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');
const fs = require('fs')
const gamestatehandler = require('./gamestatehandler');
const jsonH = require(path.resolve('./utilities/newjsonhandler.js'));
const gsh = require(path.resolve('./utilities/gamestatehandler.js'));

// Ephemeral
// interaction.reply({ content: 'Only you! :)', ephemeral: true });

function createSayEmbed(charid, phrase) {
	const numberOfArguments = arguments.length;

	let toCharacterName = null;

	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`);
	const characterName = jsonH.getCharacterName(charid);
	const finalEmbed = new MessageEmbed();

	finalEmbed.setColor(0xFB4F14);
	finalEmbed.setTitle(`${characterName} said: `);

	if (numberOfArguments > 2) {
		toCharacterName = arguments[3];
		console.log(arguments[3]);
		console.log(typeof arguments[3]);
		console.log(toCharacterName);
		console.log(typeof toCharacterName);
		finalEmbed.setTitle(`${characterName} spoke to ${toCharacterName}`);
	}

	finalEmbed
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/speak.png' })
		.setDescription(`${phrase}`)
		.setThumbnail(`attachment://${charid}.jpeg`);

	return { finalEmbed, finalFile };
}

function createSayToEmbed(charid, phrase, toChar){
    const numberOfArguments = arguments.length;

	let toCharacterName = null;

	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`);
	const characterName = jsonH.getCharacterName(charid);
	const finalEmbed = new MessageEmbed();

	finalEmbed.setColor(0xFB4F14);
	finalEmbed.setTitle(`${characterName} spoke to ${toChar}`);

	finalEmbed
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/speak.png' })
		.setDescription(`${phrase}`)
		.setThumbnail(`attachment://${charid}.jpeg`);

	return { finalEmbed, finalFile };
}

function createYellEmbed(charid, phrase) {
	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`);
	const characterName = jsonH.getCharacterName(charid);
	const finalEmbed = new MessageEmbed()
		.setColor(0xf00800)
		.setTitle(`${characterName} Yelled: `)
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/yell.png' })
		.setDescription(`${phrase}`)
		.setThumbnail(`attachment://${charid}.jpeg`);

	return { finalEmbed, finalFile };
}

const createTurnEmbed = () => {
	const finalFile = new MessageAttachment(`${path.resolve('./icons/warning.png')}`)
	const finalEmbed = new MessageEmbed();
	const characterName = gamestatehandler.whoseTurnName()
	finalEmbed
		.setColor(0xf00800)
		.setTitle(`It is now ${characterName}'s turn!`)
		.setDescription(`${characterName}, please take your turn when you can. You're timer starts now. You make speak with commands such as /say or /yell or act with commands like /action. Please use /finish to end your turn when you are done. Keep the flow going!`)
		.setThumbnail(`attachment://warning.png`);

		return { finalEmbed, finalFile };
}

const createHelpEmbed = () => {
	const finalFile = new MessageAttachment(`${path.resolve('./icons/act.png')}`)
	const finalEmbed = new MessageEmbed();
	finalEmbed
		.setColor(0xf00800)
		.setTitle(`Help`)
		.setDescription(`Here is a list of commands and what they do:`)
		.addFields(
			{ name: '/admin', value: `This command is for DMs. "/admin resetdata" will reset all data and delete all characters` },
			{ name: '/character', value: `This command displays character information. Use "/character create" to add your character! Character IDs are IDs from dnd beyond, or you can list them all with "/characer list". Feel free to explore all of the character options` },
			{ name: '/ping', value: `Check if the bot is working` },
			{ name: '/say', value: `This will create an embed of your character saying something. The phrase option is what you'd liek to say` },
			{ name: '/sayto', value: `Like say, except you can say it to someone/something specific` },
			{ name: '/action', value: `Perform an action!` },
			{ name: '/finish', value: `End your turn so others can play!` },
			{ name: '/roll', value: `Roll the dice, enter the number of dice, the sides of the dice, and the modifier` }

		)
		.setThumbnail(`attachment://act.png`);

		return { finalEmbed, finalFile };
}

function createWhisperEmbed(charid, visible, audible, toGroup, toCharID, toNPCName, phrase) {
	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`);
	const finalEmbed = new MessageEmbed();
	const characterName = jsonH.getCharacterName(charid);
	if (audible) {
		if (toGroup && !toCharID && !toNPCName) {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered loudly: `)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} whispered loudly "${phrase}"`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else if (toCharID && !toGroup && !toNPCName) {
			const toCharacterName = jsonH.getCharacterName(toCharID);
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered to ${toCharacterName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} whispered loudly "${phrase}"`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else if (toNPCName && !toGroup && !toCharID) {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered to ${toNPCName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} whispered loudly "${phrase}"`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`Error 27: ${characterName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/warning.png' })
				.setDescription(`${characterName}, you can only choose toGroup, toNPCName, or toCharID, not a combination`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
	}
	else if (visible) {
		if (toGroup && !toCharID && !toNPCName) {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered to the group: `)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} whispered loudly, however you could not hear`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else if (toCharID && !toGroup && !toNPCName) {
			const toCharacterName = jsonH.getCharacterName(toCharID);
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered to ${toCharacterName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} to ${toCharacterName}, however you could not hear what was said.`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else if (toNPCName && !toGroup && !toCharID) {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`${characterName} whispered to ${toNPCName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
				.setDescription(`${characterName} whispered to ${toNPCName}, however you could not hear what was said.`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
		else {
			finalEmbed
				.setColor(0xf00800)
				.setTitle(`Error 28: ${characterName}`)
				.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/warning.png' })
				.setDescription(`${characterName}, you can only choose toGroup, toNPCName, or toCharID, not a combination`)
				.setThumbnail(`attachment://${charid}.jpeg`);
		}
	}
	else {
		finalEmbed
			.setColor(0xf00800)
			.setTitle(`${characterName}`)
			.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/warning.png' })
			.setDescription(`${characterName} performed a private action`)
			.setThumbnail(`attachment://${charid}.jpeg`);
	}

	return { finalEmbed, finalFile };
}

function createActionEmbed(charid, action) {
	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`);
	const characterName = jsonH.getCharacterName(charid);
	const finalEmbed = new MessageEmbed()
		.setColor(0x0008f0)
		.setTitle(`${characterName}`)
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/act.png' })
		.setDescription(`${characterName} ${action}`)
		.setThumbnail(`attachment://${charid}.jpeg`);

	return { finalEmbed, finalFile };
}

function createRollEmbed(rolls, modifier, result, interaction) {
	const finalFile = new MessageAttachment(`${path.resolve(`./icons/dice.png`)}`);
	// const characterName = jsonH.getCharacterName(charid);

	let rollResult = ''

	if (modifier > 0)	{
		for (let i = 0; i < rolls.length; i++) {
			rollResult = `${rollResult}Roll ${i + 1}: ${rolls[i].rolled} + ${modifier} = ${rolls[i].withModifier}\n`
		}
	} else {
		for (let i = 0; i < rolls.length; i++) {
			rollResult = `${rollResult}Roll ${i + 1}: ${rolls[i].rolled} = ${rolls[i].withModifier}\n`
		}
	}

	rollResult += `Total: ${result}`

	const finalEmbed = new MessageEmbed()
		.setColor(0xf008f0)
		.setTitle(`${interaction.user.username} Rolled!`)
		.setAuthor({ name: `${interaction.user.username}`, iconURL: 'http://18.219.7.53/boticons/dice.png' })
		.setDescription(`${rollResult}`)
		.setThumbnail(`attachment://dice.png`);

	return { finalEmbed, finalFile };
}

function createErrorEmbed(errorCode, desc, interaction) {
	const finalFile = new MessageAttachment(`${path.resolve(`./icons/warning.png`)}`);
	const finalEmbed = new MessageEmbed()
		.setColor(0x0008f0)
		.setTitle(`Error ${errorCode}: `)
		.setDescription(`Error ${errorCode}: ${desc}`)
		.setThumbnail(`attachment://$warning.jpeg`);



	const rawErrorJson = fs.readFileSync(path.resolve('./utilities/datajsons/errorlog.json'))
	const errorJson = JSON.parse(rawErrorJson)
	const entryCount = Object.keys(errorJson).length + 1

	const errorObj = {
		code: `${errorCode}`,
		user: `${interaction.user.id}`,
		time: `${Date.now}`
	}
	errorJson[`${entryCount}`] = errorObj

	const stringify = JSON.stringify(errorJson)
	fs.writeFileSync(path.resolve('./utilities/datajsons/errorlog.json'), stringify)

	return { finalEmbed, finalFile };
}

const createInfoEmbed = (charid) => {
	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`)
	const characterName = jsonH.getCharacterName(charid)

	const charJson = jsonH.getParsedCharacterJson(charid)

	const finalEmbed = new MessageEmbed()
		.setColor(0x402b59)
		.setTitle(`${characterName}`)
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
		.setDescription(`${charJson.personality.background.description} \n `)
		.addFields(
			{ name: 'Race', value: `${charJson.race}`, inline: true },
			{ name: 'Level', value: `${charJson.level}`, inline: true },
			{ name: 'Class', value: `${jsonH.capitalizeFirstLetter(jsonH.getHighestLevelClass(charid))}`, inline: true }
		)
		.addFields(
			{ name: 'Aligment', value: `${charJson.alignment}`, inline: true },
			{ name: 'Character ID', value: `${charJson.charid}`, inline: true },
			{ name: 'Player ID', value: `${charJson.player}`, inline: true },
			{ name: 'Ideals', value: `${charJson.personality.ideals}` },
			{ name: 'Bonds', value: `${charJson.personality.bonds}` },
			{ name: 'Flaws', value: `${charJson.personality.flaws}` },
			{ name: 'Background', value: `${charJson.personality.background.title}` },
			{ name: 'Languages', value: `${jsonH.getStringOfLanguages(charid)}` }
		)
		.setThumbnail(`attachment://${charid}.jpeg`);

		return { finalEmbed, finalFile };
}

const createStatEmbed = (charid) => {
	const finalFile = new MessageAttachment(`${path.resolve(`./avatars/${charid}.jpeg`)}`)
	const characterName = jsonH.getCharacterName(charid)

	const charJson = jsonH.getParsedCharacterJson(charid)

	const finalEmbed = new MessageEmbed()
		.setColor(0x402b59)
		.setTitle(`${characterName}`)
		.setAuthor({ name: `${characterName}`, iconURL: 'http://18.219.7.53/boticons/whisper.png' })
		.setDescription(`${charJson.personality.background.description}`)
		.addFields(
			{ name: 'Race', value: `${charJson.race}`, inline: true },
			{ name: 'Level', value: `${charJson.level}`, inline: true },
			{ name: 'Class', value: `${jsonH.capitalizeFirstLetter(jsonH.getHighestLevelClass(charid))}`, inline: true }
		)
		.addFields(
			{ name: 'Aligment', value: `${charJson.alignment}`, inline: true },
			{ name: 'Character ID', value: `${charJson.charid}`, inline: true },
			{ name: 'Player ID', value: `${charJson.player}`, inline: true },
			{ name: 'Str', value: `${charJson.abilities.strength.score}`, inline: true },
			{ name: 'Dex', value: `${charJson.abilities.dexterity.score}`, inline: true },
			{ name: 'Con', value: `${charJson.abilities.constitution.score}`, inline: true },
			{ name: 'Int', value: `${charJson.abilities.intelligence.score}`, inline: true },
			{ name: 'Wis', value: `${charJson.abilities.wisdom.score}`, inline: true },
			{ name: 'Cha', value: `${charJson.abilities.charisma.score}`, inline: true }
		)
		.setThumbnail(`attachment://${charid}.jpeg`);

		return { finalEmbed, finalFile };
}

module.exports = {
	createSayEmbed: createSayEmbed,
	createYellEmbed: createYellEmbed,
	createWhisperEmbed: createWhisperEmbed,
	createActionEmbed: createActionEmbed,
	createSayToEmbed: createSayToEmbed,
	createTurnEmbed: createTurnEmbed,
	createStatEmbed: createStatEmbed,
	createInfoEmbed: createInfoEmbed,
	createHelpEmbed: createHelpEmbed,
	createErrorEmbed: createErrorEmbed,
	createRollEmbed: createRollEmbed
}

// To make message visible only to sender:
// interaction.reply({ content: 'Only you! :)', ephemeral: true });