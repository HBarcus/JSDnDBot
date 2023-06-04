//#region requires
const fs = require('fs');
const jsdom = require('jsdom')
const request = require('request-promise')
const path = require('path');
const imagedownloader = require('image-downloader');
const sharp = require('sharp');
const config = require(path.resolve('./config.json'));
const embedInterface = require(path.resolve('./utilities/embedInterface.js'));

//#endregion

//#region helper functions
function isMod(discordid) {
	return config.modIDs.includes(`${discordid}`)
}

function getParsedCharacterJson(charid) {
	const rawData = fs.readFileSync(`${getParsedCharacterSheetPath(charid)}`, 'utf-8');
	return JSON.parse(rawData);
}

const getStringOfLanguages = (charid) => {
	const jsonData = getParsedCharacterJson(charid)
	const numberSpoken = jsonData.languages.length

	let result = `${jsonData.languages[0]}`

	for (let i = 1; i < numberSpoken - 1; i++) {
		result += `, ${jsonData.languages[i]}`
	}

	if (numberSpoken > 1) {
		result += `, ${jsonData.languages[numberSpoken - 1]}.`
	}

	return result
}

function getHighestLevelClass(charid) {
	const charJson = getParsedCharacterJson(charid)

	const classKeys = Object.keys(charJson.classes)
	const numberOfClasses = classKeys.length

	const highestClassName = charJson.classes[`${classKeys[0]}`].name
	const highestClassLevel = charJson.classes[`${classKeys[0]}`].level

	for (let i = 0; i < numberOfClasses; i++) {
		if (charJson.classes[`${classKeys[i]}`].level > highestClassLevel) {
			highestClassName = charJson.classes[`${classKeys[i]}`].name
			highestClassLevel = charJson.classes[`${classKeys[i]}`].level
		}
	}

	return highestClassName;
	
}

const getAllClasses = (charid) => {
	const charJson = getParsedCharacterJson(charid)
	
	const classKeys = Object.keys(charJson.classes)
	const numberOfClasses = classKeys.length
	
	let classArr = []
	
	for (let i = 0; i < numberOfClasses; i++) {
		const classInfo = {
			className: charJson.classes[`${classKeys[i]}`].name,
			classLevel: charJson.classes[`${classKeys[i]}`].level
		}
		classArr.push(classInfo)
	}
	
	return classArr
}

const getAllAbilities = (charid) => {
	const charJson = getParsedCharacterJson(charid)
	
	const abilitykeys = Object.keys(charJson.abilities)
	const numberOfAbilities = abilitykeys.length
	
	let abilityArr = []
	
	for (let i = 0; i < numberOfAbilities; i++) {
		// const saveProficient = charJson.abilities[`${abilitykeys[i]}`].saveProf == 1 ? true: false
		const ability = {
			name: abilitykeys[i],
			score: charJson.abilities[`${abilitykeys[i]}`].score,
			modifier: charJson.abilities[`${abilitykeys[i]}`].modscore,
			saveProf: charJson.abilities[`${abilitykeys[i]}`].saveProf == 1 ? true: false
		}
		abilityArr.push(ability)
	}
	
	return abilityArr
}

// // TODO finish
// const getAllSkills = (charid) => {
// 	const charJson = getParsedCharacterJson(charid)
	
// 	const skillKeys = Object.keys(charJson.skills)
// 	const numberOfSkills = 18
	
// 	let skillArr = []
	
// 	for (let i=0; i < numberOfSkills; i++) {
// 		const isProf
// 		const skillInfo = {
// 			proficient: charJson.skills[`${skillKeys[i]}`]
// 		}
// 	}
// }

const getRace = (charid) => {
	return getParsedCharacterJson(charid).race
}

function getCharacterJson(charid) {
	const rawData = fs.readFileSync(`${getCharacterSheetPath(charid)}`, 'utf-8');
	return JSON.parse(rawData);
}

const getCharacterData = (charid) => {
	const jsonData = getCharacterJson(charid)
	return jsonData['data']
}

function getCharacterOwner(charid) {
	const jsonData = getParsedCharacterJson(charid)
	return jsonData.player
}

function getCharacterName(charid) {
	const rawData = fs.readFileSync(`${getParsedCharacterSheetPath(charid)}`, 'utf-8');
	const jsonData = JSON.parse(rawData);
	return jsonData.name;
}

function getCurrentTurn() {
	const rawData = fs.readFileSync(`${path.resolve('./utilities/datajsons/data.json')}`);
	const jsonData = JSON.parse(rawData);
	return jsonData['currentTurn'];
}

const getCurrentTimerLength = () => {
	const rawData = fs.readFileSync(`${path.resolve('./utilities/datajsons/data.json')}`);
	const jsonData = JSON.parse(rawData);
	return jsonData['timerLength'];
}

const setTimerLength = (ms) => {
	const rawData = fs.readFileSync(`${path.resolve('./utilities/datajsons/data.json')}`);
	const jsonData = JSON.parse(rawData);
	jsonData['timerLength'] = ms
	const stringify = JSON.stringify(jsonData)
	fs.writeFileSync(`${path.resolve('./utilities/datajsons/data.json')}`, stringify)
}

function getCharacterNamesAndIds() {
	const dirPath2 = path.resolve('./charactersheets/parsed/')
	// console.log('dirPath2:', dirPath2)

	let files = fs.readdirSync(dirPath2)
	let filesNoExt = []

	// console.log('files:', files)

	files.forEach(file => {
		filesNoExt.push(file.split('.')[0])
	})

	// console.log('filesNoExt:', filesNoExt)

	let charArray = []

	for (let i = 0; i < files.length; i++) {
		const newChar = {
			id: filesNoExt[i],
			name: getCharacterName(filesNoExt[i])
		}
		charArray.push(newChar)
	}

	// console.log('charArray:', charArray)

	return charArray
}

function getAvatarURL(charid) {
	const rawData = fs.readFileSync(`${getCharacterSheetPath(charid)}`, 'utf-8');
	const jsonData = JSON.parse(rawData);
	const avaURL = jsonData['data'].avatarUrl;
	if (avaURL !== null) {
		const finalURL = avaURL.split('?')[0];
		return finalURL;
	} else {
		return null
	}
}

function getCharacterSheetPath(charid) {
	return path.resolve(`./charactersheets/${charid}.json`);
}

function getParsedCharacterSheetPath(charid) {
	return path.resolve(`./charactersheets/parsed/${charid}.json`);

}

function getAvatarThumbnailPath(charid) {
	return path.resolve(`./avatars/${charid}.jpeg`)
}

function getAvatarOriginalPath(charid) {
	return path.resolve(`./avatars/originals/${charid}.jpeg`)
}

function doesCharacterExist(charid) {
	return fs.existsSync(`./charactersheets/parsed/${charid}.json`)
}

const camelCase = (string) => {
	if (string.indexOf(' ') >= 0) {
		const newString = string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }).replace(/\s+/g, '');
		return newString[0].toLowerCase() + newString.substring(1);
	}

	return string.toLowerCase()
}

const getTotalAbilityScore = function(character, scoreId) {
    var index = scoreId-1;
	const _ABILITY_ = {"STR": "strength", "DEX": "dexterity", "CON": "constitution", "INT": "intelligence", "WIS": "wisdom", "CHA": "charisma"};

	const _ABILITIES_ = {1:"STR",2:"DEX",3:"CON",4:"INT",5:"WIS",6:"CHA"};

    var base = (character.stats[index].value == null ? 10 : character.stats[index].value),
        bonus = (character.bonusStats[index].value == null ? 0 : character.bonusStats[index].value),
        override = (character.overrideStats[index].value == null ? 0 : character.overrideStats[index].value),
        total = base + bonus,
        modifiers = getObjects(character, '', `${_ABILITY_[_ABILITIES_[scoreId]]}-score`);
    if(override > 0) total = override;
    if(modifiers.length > 0) {
        var used_ids = [];
        for(var i = 0; i < modifiers.length; i++){
            if(modifiers[i].type == 'bonus' && used_ids.indexOf(modifiers[i].id) == -1) {
                total += modifiers[i].value;
                used_ids.push(modifiers[i].id);
            }
        }
    }
    if (total > 20) {
        total = 20;
    }
    return total;
};

const getObjects = function(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
};

const fixDesc = (string) => {
	const dom = new jsdom.JSDOM(`<!DOCTYPE html>
	<body></body>`);
	const jquery = require("jquery")(dom.window)

	jquery("body").append(`${string.replace(/<\/p\s*>/, ' ').replace(/\n/g, " ")}`);
	const content = dom.window.document.querySelector("body");
	let retString = content.textContent
	retString = retString.replace(/([a-z])([A-Z])/g, '$1 $2')
	retString = retString.replace(/([A-Z])([A-Z])/g, '$1 $2')
	return retString
}

const fixQuote = (badString) => {
	if (badString == "" || badString == null) {
		return ""
	}
	return badString.replace(/\n/g, '\n').replace(/\u2019/g, "'").replace(/\u2014/g, "-").replace(/\u2022/g, ":").replace(/&nbsp;/g, " ").replace(/&rsquo;/g, "'").replace(/\s&/g, "&").trim();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getComponentString(eachSpell) {
	let componentList = "";
	if (eachSpell.definition.components.indexOf(1) != -1) {
		componentList += "V, ";
	}
	if (eachSpell.definition.components.indexOf(2) != -1) {
		componentList += "S, ";
	}
	if (eachSpell.definition.components.indexOf(3) != -1) {
		componentList += "M (" + eachSpell.definition.componentsDescription + "), ";
	}
	componentList = componentList.trim().slice(0, -1);

	return componentList
}

function getCastingTime(eachSpell) {
	let castingTime = "";
	if (eachSpell.definition.activation.activationTime == null) {
		castingTime = "";
	} else {
		castingTime = eachSpell.definition.activation.activationTime;
	}

	// get castingTime
	if (eachSpell.definition.activation.activationType == null) {
		castingTime += "";
	} else if (eachSpell.definition.activation.activationType == 1) {
		castingTime += " action";
	} else if (eachSpell.definition.activation.activationType == 3) {
		castingTime += " bonus action";
	} else if (eachSpell.definition.activation.activationType == 4) {
		castingTime += " reaction";
	} else if (eachSpell.definition.activation.activationType == 5) {
		castingTime += " second";
	} else if (eachSpell.definition.activation.activationType == 6) {
		castingTime += " minute";
	} else if (eachSpell.definition.activation.activationType == 7) {
		castingTime += " hour";
	} else if (eachSpell.definition.activation.activationType == 8) {
		castingTime += " day";
	}

	return castingTime
}

const getCharacterOwnerShortName = (charid) => {
	const parsedJson = getParsedCharacterJson(charid)
	return parsedJson.ownerUsername
}

const getCharacterOwnerFullName = (charid) => {
	const parsedJson = getParsedCharacterJson(charid)
	return parsedJson.ownerFull
}
//#endregion

//#region main functions

const resetCharacterData = () => {
	const originalSheetsDir = path.resolve("./charactersheets/")
	const parsedSheetsDir = path.resolve("./charactersheets/parsed/")
	const originalAvatarsDir = path.resolve("./avatars/originals/")
	const thumbnailAvatarsDir = path.resolve("./avatars/")

	// recursively delete ./avatars recursive
	try {
		fs.rmSync(thumbnailAvatarsDir, { recursive: true });
	} catch (err) {
		console.error('Error deleting avatar dir')
	}
	// recursively delete ./charactersheets recursive
		try {
		fs.rmSync(originalSheetsDir, { recursive: true });
	} catch (err) {
		console.error('Error deleting original character sheet dir')
	}
	// create ./charactersheets/parsed recursive
	if(!fs.existsSync(parsedSheetsDir)) {
		fs.mkdirSync(parsedSheetsDir, { recursive: true })
	}
	// create ./avatars/originals recursive
		if(!fs.existsSync(originalAvatarsDir)) {
		fs.mkdirSync(originalAvatarsDir, { recursive: true })
	}
	
	// delete turnid file and recreat as empty json turnids
	let newTurnData = JSON.parse('{}')
	const newTurnString = JSON.stringify(newTurnData)
	fs.writeFileSync(`${path.resolve('./utilities/datajsons/turnList.json')}`, newTurnString)
}


function removeCharacterFromTurns(charid) {
	const rawTurnData = fs.readFileSync(`${path.resolve('./utilities/datajsons/turnList.json')}`, 'utf-8');
	let jsonTurnData = JSON.parse(rawTurnData);
	let jsonTurnKeys = Object.keys(jsonTurnData)
	
	jsonTurnKeys.forEach(key => {
		if(jsonTurnData[`${key}`] == `${charid}`){
			delete jsonTurnData[`${key}`]
		}
	})

	let currentTurnLoop = 1

	let newTurnData = JSON.parse('{}')

	for (let key in jsonTurnData) {
		newTurnData[`${currentTurnLoop}`] = jsonTurnData[`${key}`]
		currentTurnLoop++
	}
	
	const newTurnString = JSON.stringify(newTurnData)
	fs.writeFileSync(`${path.resolve('./utilities/datajsons/turnList.json')}`, newTurnString)
}

function removeCharacterFiles(charid) {
	if (doesCharacterExist(charid)) {
		if (fs.existsSync(getCharacterSheetPath(charid))) {
			fs.unlinkSync(getCharacterSheetPath(charid))
		}
		
		if (fs.existsSync(path.resolve(`./charactersheets/parsed/${charid}.json`))) {
			fs.unlinkSync(path.resolve(`./charactersheets/parsed/${charid}.json`))
		}

		if (fs.existsSync(getAvatarThumbnailPath(charid))) {
			fs.unlinkSync(getAvatarThumbnailPath(charid))
		}
		
		if (fs.existsSync(getAvatarOriginalPath(charid))) {
			fs.unlinkSync(getAvatarOriginalPath(charid))
		}
	}
}

function removeCharacter(charid, interaction) {
	if (doesCharacterExist(charid)) {
		if (getCharacterOwner(charid) == interaction.user.id || isMod(interaction.user.id)) {
			removeCharacterFromTurns(charid)
			removeCharacterFiles(charid)
			interaction.reply(`${charid} has been removed`)
		} else {
			interaction.reply(`${charid} is not your character and you are not a DM. Contact a DM to perform this action.`)
		}
	} else {
		interaction.reply(`${charid} does not match a character. Nothing to delete`)
	}
}

function updateCharacter(charid, interaction) {
	if (doesCharacterExist(charid)) {
		
		const url = `https://character-service.dndbeyond.com/character/v3/character/${charid}`;
		const options = {
			uri: url
		}
	
		request(options).then((response) => {
			return response
		}).then((json) => {
			let oldJsonRaw = fs.readFileSync(getCharacterSheetPath(charid))
			const oldJSON = JSON.parse(oldJsonRaw)
			const oldTurnId = oldJSON['data'].turnId
			const oldDiscordID = oldJSON['data'].discordId
			let jsonData = JSON.parse(json)
			jsonData['data'].discordId = oldDiscordID
			jsonData['data'].turnId = oldTurnId
			const jsonString = JSON.stringify(jsonData)
			fs.writeFileSync(getCharacterSheetPath(`${charid}`), jsonString)
			createNewJson(charid)
		}).then(() => {
			if (fs.existsSync(path.resolve(`./avatars/originals/${charid}.jpeg`))) {
				fs.unlinkSync(path.resolve(`./avatars/originals/${charid}.jpeg`))
			}
			if (fs.existsSync(path.resolve(`./avatars/${charid}.jpeg`))) {
				fs.unlinkSync(path.resolve(`./avatars/${charid}.jpeg`))
			}
			if(getAvatarURL(charid) !== null) {
				const avatarURL = getAvatarURL(charid);
				const imagePath = path.resolve(`./avatars/originals/${charid}.jpeg`);
				fs.openSync(imagePath, 'w');
				let outputFile = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
				fs.openSync(outputFile, 'w');
				let imgOptions = { url: `${avatarURL}`, dest: `${imagePath}` };
				return imagedownloader.image(imgOptions)
			} else {
				const newObj = {
					filename: 'DefaultAvatar.jpeg'
				}
				return newObj
			}
		}).then(() => {
			if (getAvatarURL(charid) !== null) {
				const imagePath2 = path.resolve(`./avatars/originals/${charid}.jpeg`);
				let outputFile2 = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
				sharp(imagePath2).resize({ height:150 }).toFile(outputFile2);
			} else {
				const imagePath2 = path.resolve(`./utilities/DefaultAvatar.jpeg`);
				let outputFile2 = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
				sharp(imagePath2).resize({ height:150 }).toFile(outputFile2);
			}
		}).then(() => {
			const rawData = fs.readFileSync(`${getParsedCharacterSheetPath(charid)}`, 'utf-8');
			const jsonData = JSON.parse(rawData);
			interaction.reply(`${jsonData.name} Updated`)
		}).catch((e) => {
			console.log(e)
		})
	} else {
		console.log('Character not in db. Use /character create first')
		interaction.reply(`${charid} not create. Use /character create ${charid} first`)
	}
}

function createNewCharacter(charid, playerid, interaction) {
	const url = `https://character-service.dndbeyond.com/character/v3/character/${charid}`;
	const options = {
		uri: url
	}
	
	request(options).then((response) => {
		return response
	}).then((json) => {
		let jsonData = JSON.parse(json);
		const rawTurnData = fs.readFileSync(`${path.resolve('./utilities/datajsons/turnList.json')}`, 'utf-8');
		let jsonTurnData = JSON.parse(rawTurnData)
		const currentTurns = Object.keys(jsonTurnData).length
		jsonData['data'].discordId = playerid
		jsonData['data'].turnId = currentTurns + 1
		jsonTurnData[`${currentTurns + 1}`] = charid
		const jsonString = JSON.stringify(jsonData)
		const turnString = JSON.stringify(jsonTurnData)
		fs.writeFileSync(getCharacterSheetPath(`${charid}`), jsonString)
		fs.writeFileSync(`${path.resolve('./utilities/datajsons/turnList.json')}`, turnString)
		createNewJson(charid)
	}).then(() => {
		if(getAvatarURL(charid) !== null) {
			const avatarURL = getAvatarURL(charid);
			const imagePath = path.resolve(`./avatars/originals/${charid}.jpeg`);
			fs.openSync(imagePath, 'w');
			let outputFile = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
			fs.openSync(outputFile, 'w');
			let imgOptions = { url: `${avatarURL}`, dest: `${imagePath}` };
			return imagedownloader.image(imgOptions)
		} else {
			const newObj = {
				filename: 'DefaultAvatar.jpeg'
			}
			return newObj
		}
	}).then(() => {
		if (getAvatarURL(charid) !== null) {
			const imagePath2 = path.resolve(`./avatars/originals/${charid}.jpeg`);
			let outputFile2 = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
			sharp(imagePath2).resize({ height:150 }).toFile(outputFile2);
		} else {
			const imagePath2 = path.resolve(`./utilities/DefaultAvatar.jpeg`);
			let outputFile2 = `${path.resolve(`./avatars/${charid}.jpeg`)}`;
			sharp(imagePath2).resize({ height:150 }).toFile(outputFile2);
		}
	}).then(() => {
		const rawData = fs.readFileSync(`${getParsedCharacterSheetPath(charid)}`, 'utf-8');
		const jsonData = JSON.parse(rawData);
	}).catch((e) => {
		console.log(e)
	}).then(() => {
			// const url = `https://discord.com/api/v9/users/${charid}`
			let parsedJson = getParsedCharacterJson(charid)
				let apiOptions = {
					url: `https://discord.com/api/v9/users/${getCharacterOwner(charid)}`,
					headers: {
						'Authorization': `Bot ${config.token}`
					},
					json: true
				}
			// fetch(`${url}`).then((response) => {
			// 	response.json().then((data) => {
			// 		parsedJson['owner'] = data.username
			// 	})
			// })
			
			request(apiOptions).then((apidata) => {
				let fullUsername = ''
				parsedJson['ownerUsername'] = apidata.username
				parsedJson['ownerDiscriminator'] = apidata.discriminator
				parsedJson['ownerFull'] = apidata.username + '#' + apidata.discriminator
				let stringify = JSON.stringify(parsedJson)
				fs.writeFileSync(`${getParsedCharacterSheetPath(charid)}`, stringify)
			}).catch((e) => {
				console.log(e)
			})
	}).then(() => {
		interaction.reply({ content: `Character Created`, ephemeral: true }).catch(() => console.log('error'))
	})
}

const createNewJson = (charid) => {

	//#region setUpIntialVariables
	var addHP = 0;

	var charSpellSlots1 = 0, charSpellSlots2 = 0, charSpellSlots3 = 0, charSpellSlots4 = 0, charSpellSlots5 = 0, charSpellSlots6 = 0, charSpellSlots7 = 0, charSpellSlots8 = 0, charSpellSlots9 = 0;

	var holdFeatures, holdProf = [];

	var hasAppear = 0;

	var casterLevels = 0, casterClasses = 0, totalClasses = 0;

	const DEBUG = false;
	const _ABILITIES = {1:"STR",2:"DEX",3:"CON",4:"INT",5:"WIS",6:"CHA"};
	const _ABILITY = {"STR": "strength", "DEX": "dexterity", "CON": "constitution", "INT": "intelligence", "WIS": "wisdom", "CHA": "charisma"};
	const justAbilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

	const skills = ["acrobatics", "animal_handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight_of_hand", "stealth", "survival"];
	const skillsRef = ["dexterity", "wisdom", "intelligence", "strength", "charisma", "intelligence", "wisdom", "charisma", "intelligence", "wisdom", "intelligence", "wisdom", "charisma", "charisma", "intelligence", "dexterity", "dexterity", "wisdom"];
	const simpleMeleeWeapon = ["club","dagger","greatclub","handaxe","javelin","light_hammer","mace","quartrsfaff","sickle","spear"];
	const simpleRangedWeapon = ["crossbow_light","dart","showtbow","sling"];
	const martialMeleeWeapon = ["battleaxe","flail","glaive","greataxe","greatsword","halberd","lance","longsword","maul","morningstar","pike","rapier","scimitar","shortsword","trident","war_pick","warhammer","whip"];
	const martialRangedWeapon = ["blowgun","crossbow_hand","crossbow_heavy","longbow","net"];
	const tieflingRacialTraits = ["darkvision","hellish_resistance"];

	var object;

	const fullDexArmor = ["padded","leather","studded_leather"];
	const max3DexArmor = [];
	const max2DexArmor = ["hide","chain_shirt","scale_mail","breastplate","half_plate"];
	const noDexArmor = ["ring_mail","chain_mail","splint","plate"];

	var totalLevels = 0, totalHP = 0;
	var isArtificer = 0, isBarbarian = 0, isBard = 0, isCleric = 0, isDruid = 0, isFighter = 0, isMonk = 0, isPaladin = 0, isRanger = 0, isRogue = 0, isSorcerer = 0, isWarlock = 0, isWizard = 0, isBloodHunter = 0, levelBarbarian = 0;
	var levelBard = 0, levelCleric = 0, levelDruid = 0, levelFighter = 0, levelMonk = 0, levelPaladin = 0, levelRanger = 0, levelRogue = 0, levelSorcerer = 0, levelWarlock = 0, levelWizard = 0, levelBloodHunter = 0, levelArtificer = 0, fighterSubclassEldritchKnight = 0;
	var rogueSubclassArcaneTrickster = 0;

	var barbRages = 0;
	var barbPrimalPath = "", barbTotemSpirit = "", barbBeastAspect = "";

	var bardCollege = "", clericDomain = "", druidCircle = "", fighterArchetype = "", monkWay = "", paladinOath = "", rangerArchtype = "", rogueArchetype = "", sorcererOrigin = "", warlockPatron = "", wizardSchool = "";
	var usingHeavyArmor = 0;

	var numArrows = 0, numNeedles = 0, numBolts = 0, numBullets = 0;

	var addBonusArmorAC = 0, addBonusOtherAC = 0, addSavingThrows = 0;

	var addSpeed = 0;

	var strScore = 0, strMod = 0, strProf = 0, chaScore = 0, chaMod = 0, chaProf = 0, conScore = 0, conMod = 0, conProf = 0, intScore = 0, intMod = 0, intProf = 0, dexScore = 0, dexMod = 0, dexProf = 0, wisScore = 0, wisMod = 0, wisProf = 0;

	var hpBarbarian = 7, hpBard = 5, hpCleric = 5, hpDruid = 5, hpFighter = 6, hpMonk = 5, hpPaladin = 6, hpRanger = 6, hpRogue = 5, hpSorcerer = 4, hpWarlock = 5, hpWizard = 4, hpBloodHunter = 6, hpArtificer = 5, hpStartBarbarian = 12;
	
	var hpStartBard = 8, hpStartCleric = 8, hpStartDruid = 8, hpStartFighter = 10, hpStartMonk = 8, hpStartPaladin = 10, hpStartRanger = 10, hpStartRogue = 8, hpStartSorcerer = 6, hpStartWarlock = 8, hpStartWizard = 6, hpStartBloodhunter = 10, hpStartArtificer = 8;

	var sumHP = 0;

	var mamFeat = 0, alertFeat = 0, mobileFeat = 0, obsFeat = 0, profBonus = 0, passWisBonus = 0;

	var charWalk = 0;
	const character = getCharacterData(charid)
	const newJSON = JSON.parse('{}')
	//#endregion

	//Set name an id
	newJSON['player'] = character.discordId
	newJSON['charid'] = charid
	newJSON['turnid'] = character.turnId
	newJSON['name'] = character['name']
	newJSON['avatarURL'] = character.avatarUrl

	//#region set character alignment
	var charAlign = "";
	switch (character.alignmentId) {
        case 1:
            charAlign = "Lawful Good";
            break;
        case 2:
            charAlign = "Neutral Good";
            break;
        case 3:
            charAlign = "Chaotic Good";
            break;
        case 4:
            charAlign = "Lawful Neutral";
            break;
        case 5:
            charAlign = "Neutral";
            break;
        case 6:
            charAlign = "Chaotic Neutral";
            break;
        case 7:
            charAlign = "Lawful Evil";
            break;
        case 8:
            charAlign = "Neutral Evil";
            break;
        case 9:
            charAlign = "Chaotic Evil";
            break;
        default:
            charAlign = "None Selected";
	}

	newJSON.alignment = charAlign
//#endregion

	//#region check for fleet of foot and swift
	character.race.racialTraits.some(function(fleet_trait) {
        if(fleet_trait.definition.name == "Fleet of Foot" || fleet_trait.definition.name == "Swift") {
            addSpeed += 5;
        }
    });
	//#endregion
	
	// set race name
	newJSON.race = character.race.fullName
	newJSON['classes'] = {

	}

	let personTraits = {
		ideals: "",
		bonds: "",
		flaws:"",
		background: {
			title: "",
			description: ""
		}
	}
	
	// newJSON['personality'] = personTraits

	//#region setup traits
    if(character.traits.ideals != null) {
        personTraits.ideals = fixQuote(character.traits.ideals)
    }
    if(character.traits.bonds != null) {
        personTraits.bonds = fixQuote(character.traits.bonds)
    }
    if(character.traits.flaws != null) {
        personTraits.flaws = fixQuote(character.traits.flaws)
    }
    newJSON['personality']= personTraits
	//#endregion

	//#region setup Background
	// if (character.background.definition.name != null){
	// 	newJSON['personality']['background'].title = character.background.definition.name
	// 	newJSON['personality']['background'].description = `${fixDesc(character.background.definition.shortDescription)}`
	// }

	try {
		newJSON['personality']['background'].title = character.background.definition.name
	} catch(e) {
		newJSON['personality']['background'].title = "No Background Selected"
	}

	try {
		newJSON['personality']['background'].description = `${fixDesc(character.background.definition.shortDescription)}`
	} catch(e) {
		newJSON['personality']['background'].description = "No Background Description"
	}



	//#endregion

	//#region setupSkillList
	var idCount = 1;
    var hasHalf = 0;
    //var halfProf = false;
    var profValue = 0;
    var halfprof = getObjects(character, 'type', 'half-proficiency');
    for (var x in halfprof) {
        var hfprof = halfprof[x];
        var type = hfprof.subType;
        if(type == 'ability-checks') {
            hasHalf = 1;
        }
    }

	newJSON['skills'] = {
		
	}

    skills.some(function(element) {
        profValue = 0;
		
		let newSkill = {
			name: "",
			stat: "",
			prof: 0
		}

        if(element.match(/^sleight/)) {
			newSkill.name = 'sleightOfHand';
			newSkill.stat = 'dex';
			newSkill.prof = 0;
        } else if(element.match(/animal/)) {
			newSkill.name = 'animalHandling';
			newSkill.stat = 'dex';
			newSkill.prof = 0;
        } else {
			newSkill.name = `${element}`;
			newSkill.stat = '';
			newSkill.prof = 0;
        }

        newSkill.stat = skillsRef[idCount - 1]

        var proficiencies = getObjects(character, 'type', 'proficiency');
        if(proficiencies != null) {
            proficiencies.some(function(prof) {
                var skill = prof.subType.replace(/-/g, '_');
                if(skill == element) {
                    profValue = 1;
                }
            });
        }
        var expertise = getObjects(character, 'type', 'expertise');
        if(expertise != null) {
            expertise.some(function(exp) {
                var expSkill = exp.subType.replace(/-/g, '_');
                if(expSkill == element) {
                    profValue = 2;
                }
            });
        }

        if(profValue == 0) {
            if(hasHalf == 1) {
                newSkill.prof = 3
            } else {
                newSkill.prof = 0
            }
        } else if(profValue == 1) {
			newSkill.prof = 1
        } else if(profValue == 2) {
			newSkill.prof = 2
        }

		newJSON['skills'][`${camelCase(newSkill.name)}`] = {
			stat: "",
			prof: 0
		}
		
		newJSON['skills'][`${camelCase(newSkill.name)}`].stat = newSkill.stat;
		newJSON['skills'][`${camelCase(newSkill.name)}`].prof = newSkill.prof;
        idCount += 1;
    });

	//#endregion

	//#region abilities

	newJSON['abilities'] = {

	}

	justAbilities.some(function(thisAbility, ja) {
        let abilScore = parseInt(getTotalAbilityScore(character, ja + 1));
		newJSON['abilities'][`${camelCase(thisAbility)}`] = {
			bonus: 0,
			score: 0,
			saveProf: 0
		}

        if (abilScore > 20) {
            abilScore = 20;
        }

        let modScore = parseInt(abilScore / 2) - 5;

		let newAbility = {
			modscore: modScore,
			score: abilScore,
			saveProf: 0
		}

		character.modifiers.class.some(function(thisMod) {
            if(thisMod.subType == thisAbility + "-saving-throws") {
				newAbility.saveProf = 1
            }
        });
		newJSON['abilities'][`${camelCase(thisAbility)}`] = newAbility
    });
	//#endregion

	//#region setup class
	character.classes.some(function(current_class) {
        let thisClass = current_class.definition.name.toLowerCase();

		let newClass = {
			name: `${camelCase(thisClass)}`,
			level: 0,
			hitdie: `d${parseInt(current_class.definition.hitDice)}`,
			description: `${fixDesc(current_class.definition.description)}`,
			casterPactMagic: false,
			casterLevelInvMult: 0
		}

		if (newJSON['abilities']['constitution'].modScore > 0 && newJSON['abilities']['constitution'].modScore != undefined) {
			newClass.hitdie = newClass.hitdie + '+' + `${newJSON['abilities']['constitution'].modScore}`
		}

         if (thisClass == "barbarian") {
            isBarbarian = 1;
            levelBarbarian = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartBarbarian + ((levelBarbarian - 1) * hpBarbarian);
            } else {
                sumHP += levelBarbarian  * hpBarbarian;
            }


            switch (parseInt(levelBarbarian)) {
                case 1: case 2:
                    barbRages = 2;
                    break;
                case 3: case 4: case 5:
                    barbRages = 3;
                    break;
                case 6: case 7: case 8: case 9: case 10: case 11:
                    barbRages = 4;
                    break;
                case 12: case 13: case 14: case 15: case 16:
                    barbRages = 5;
                    break;
                case 17: case 18: case 19:
                    barbRages = 6;
                    break;
                default:
                    barbRages = 0;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                barbPrimalPath = current_class.subclassDefinition.name;
                current_class.subclassDefinition.classFeatures.some(function(findTotem) {
                    if(levelBarbarian >= findTotem.requiredLevel) {
                        if (findTotem.name.match("Totem Spirit")) {
                            let animalID = findTotem.id;
                            character.options.class.some(function(guessing) {
                                if (animalID == guessing.componentId) {
                                    barbTotemSpirit = guessing.definition.name;
                                }
                            });
                        } else if (findTotem.name.match("Aspect of the Beast")) {
                            let animalID = findTotem.id;
                            character.options.class.some(function(guessing) {
                                if (animalID == guessing.componentId) {
                                    barbBeastAspect = guessing.definition.name;
                                }
                            });
                        } else if (findTotem.name.match("Totemic Attunement")) {
                            let animalID = findTotem.id;
                            character.options.class.some(function(guessing) {
                                if (animalID == guessing.componentId) {
                                }
                            });
                        }
                    }
                });
            }
        } else if (thisClass == "bard") {
            isBard = 1;
            levelBard = current_class.level;
            casterLevels += levelBard;
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartBard + ((levelBard - 1) * hpBard);
            } else {
                sumHP += levelBard  * hpBard;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                bardCollege = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "cleric") {
            isCleric = 1;
            levelCleric = current_class.level;
            casterLevels += levelCleric;
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartCleric + ((levelCleric - 1) * hpCleric);
            } else {
                sumHP += levelCleric  * hpCleric;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                clericDomain = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "druid") {
            isDruid = 1;
            levelDruid = current_class.level;
            casterLevels += levelDruid;
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartDruid + ((levelDruid - 1) * hpDruid);
            } else {
                sumHP += levelDruid  * hpDruid;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                druidCircle = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "fighter") {
            isFighter = 1;
            levelFighter = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartFighter + ((levelFighter - 1) * hpFighter);
            } else {
                sumHP += levelFighter  * hpFighter;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                fighterArchetype = current_class.subclassDefinition.name;
                if(current_class.subclassDefinition.name == "Eldritch Knight") {
                    fighterSubclassEldritchKnight = 1;
                    casterLevels += Math.floor(levelFighter / 3);
                    casterClasses += 1;
                }
            }
        } else if (thisClass == "monk") {
            isMonk = 1;
            levelMonk = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartMonk + ((levelMonk - 1) * hpMonk);
            } else {
                sumHP += levelMonk  * hpMonk;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                monkWay = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "paladin") {
            isPaladin = 1;
            levelPaladin = current_class.level;
            casterLevels += Math.floor(levelPaladin / 2);
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartPaladin + ((levelPaladin - 1) * hpPaladin);
            } else {
                sumHP += levelPaladin  * hpPaladin;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                paladinOath = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "ranger") {
            isRanger = 1;
            levelRanger = current_class.level;
            casterLevels += Math.floor(levelRanger / 2);
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartRanger + ((levelRanger - 1) * hpRanger);
            } else {
                sumHP += levelRanger  * hpRanger;
            }
            if(current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                rangerArchtype = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "rogue") {
            isRogue = 1;
            levelRogue = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartRogue + ((levelRogue - 1) * hpRogue);
            } else {
                sumHP += levelRogue  * hpRogue;
            }
            if (current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                rogueArchetype = current_class.subclassDefinition.name;
                if(rogueArchetype == "Arcane Trickster") {
                    rogueSubclassArcaneTrickster = 1;
                    casterLevels += Math.floor(levelRogue / 3);
                    casterClasses += 1;
                } else if (rogueArchetype.match(/Swashbuckler/)) {

                }
            }
        } else if (thisClass == "sorcerer") {
            isSorcerer = 1;
            levelSorcerer = current_class.level;
            casterLevels += levelSorcerer;
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartSorcerer + ((levelSorcerer - 1) * hpSorcerer);
            } else {
                sumHP += levelSorcerer  * hpSorcerer;
            }
            if (current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                sorcererOrigin = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "warlock") {
            isWarlock = 1;
            levelWarlock = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartWarlock + ((levelWarlock - 1) * hpWarlock);
            } else {
                sumHP += levelWarlock  * hpWarlock;
            }
            if (current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                warlockPatron = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "wizard") {
            isWizard = 1;
            levelWizard = current_class.level;
            casterLevels += levelWizard;
            casterClasses += 1;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartWizard + ((levelWizard - 1) * hpWizard);
            } else {
                sumHP += levelWizard  * hpWizard;
            }
            if (current_class.hasOwnProperty("subclassDefinition") && current_class.subclassDefinition != null) {
                wizardSchool = current_class.subclassDefinition.name;
            }
        } else if (thisClass == "blood hunter" || thisClass == "blood hunter (archived)") {
            isBloodHunter = 1;
            levelBloodHunter = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartBloodhunter + ((levelBloodHunter - 1) * hpBloodHunter);
            } else {
                sumHP += levelBloodHunter  * hpBloodHunter;
            }
        } else if (thisClass == "artificer") {
            isArtificer = 1;
            levelArtificer = current_class.level;
            if (current_class.isStartingClass == true) {
                sumHP += hpStartArtificer + ((levelArtificer - 1) * hpArtificer);
            } else {
                sumHP += levelArtificer  * hpArtificer;
            }
        }
        totalClasses += 1;
        totalLevels += current_class.level;

		newClass.casterPactMagic = (thisClass === "warlock")
		newClass.level = current_class.level

		switch(thisClass) {
			case 'bard': case 'bard': case 'cleric': case 'druid': case 'sorcerer': case 'warlock': case 'wizard': case 'artificer': 
			newClass.casterLevelInvMult = 1;
			case 'warlock': case 'ranger':
				if(current_class.level >= 2){
					newClass.casterLevelInvMult = 2;
				}
			case 'rogue': case 'fighter':
				if(current_class.hasOwnProperty('subclassDefinition') && current_class.subclassDefinition != null) {
					if(current_class.subclassDefinition.name == "Arcane Trickster" || current_class.subclassDefinition.name == "Eldritch Knight") {
						newClass.casterLevelInvMult = 3;
					}
				}
		}

		newJSON['classes'][`${camelCase(thisClass)}`] = newClass
	});

	newJSON.level = totalLevels
	//#endregion

	//#region create spellList
	let spellsList = []
	newJSON['powers'] = {

	}
	// let powers = newJSON['powers']
	if(character.spells.race.length > 0){
		character.spells.race.some(function(eachSpell) {
			if(!spellsList.includes(eachSpell.definition.name)) {
				let newPower = {
					level: 0,
					range: '',
					school: '',
					castingTime: '',
					components: '',
					duration: '',
					group: ''
				}
				spellsList.push(eachSpell.definition.name)
	
				// const spellName = fixQuote(eachSpell.definition.name)
	
				//set spell name
				newPower.name = eachSpell.definition.name
				
				newPower.castingTime = getCastingTime(eachSpell)
				newPower.components = getComponentString(eachSpell);
	
				if(eachSpell.definition.duration.durationType == "Time") {
					newPower.duration = eachSpell.definition.duration.durationInterval + " " + eachSpell.definition.duration.durationUnit
				} else if(eachSpell.definition.duration.durationType == "Instantaneous") {
					newPower.duration = "Instantaneous"
				}
	
				newPower.group = "Spells"
				
				// Set spell level
				newPower.level = eachSpell.definition.level
	
				// Set spell range
				if(eachSpell.definition.range.origin == "Ranged"){
					newPower.range = eachSpell.definition.range.rangeValue
				} else if (eachSpell.definition.range.origin == "Touch") {
					newPower.range = "Touch"
				} else if (eachSpell.definition.range.origin == "Self") {
					newPower.range = "Self"
				}
	
				// Set spell school
				newPower.school = fixQuote(eachSpell.definition.school)
				newJSON['powers'][`${newPower.name}`] = newPower
			}
		})
	}
	
	if (character.spells.class.length > 0) {
		character.spells.class.some(function(eachSpell) {
			if(!spellsList.includes(eachSpell.definition.name)) {
				let newPower = {
					level: 0,
					range: '',
					school: '',
					castingTime: '',
					components: '',
					duration: '',
					group: ''
				}
				spellsList.push(eachSpell.defintion.name);
				newPower.name = eachSpell.definition.name
	
				let castingTime = ""
				newPower.castingTime = getCastingTime(eachSpell)
				newPower.components = getComponentString(eachSpell);
	
				if(eachSpell.definition.duration.durationType == "Time") {
					newPower.duration = eachSpell.definition.duration.durationInterval + " " + eachSpell.definition.duration.durationUnit
				} else if(eachSpell.definition.duration.durationType == "Instantaneous") {
					newPower.duration = "Instantaneous"
				}
	
				newPower.group = "Spells"
				
				// Set spell level
				newPower.level = eachSpell.definition.level
	
				// Set spell range
				if(eachSpell.definition.range.origin == "Ranged"){
					newPower.range = eachSpell.definition.range.rangeValue
				} else if (eachSpell.definition.range.origin == "Touch") {
					newPower.range = "Touch"
				} else if (eachSpell.definition.range.origin == "Self") {
					newPower.range = "Self"
				}
	
				// Set spell school
				newPower.school = fixQuote(eachSpell.definition.school)
				newJSON['powers'][`${newPower.name}`] = newPower
			}
		})
	}
	
	character.classes.some(function(current_class) {
		for(var j in character.classSpells) {
			if(character.classSpells[j].characterClassId == current_class.id) {
				character.classSpells[j].spells.some(function(spell) {
					let newPower = {
						level: 0,
						range: '',
						school: '',
						castingTime: '',
						components: '',
						duration: '',
						group: ''
					}
					if(!spellsList.includes(spell.definition.name)) {
						if(spell.prepared == true || spell.alwaysPrepared == true || spell.definition.level == 0 || isSorcerer == 1 || isRanger == 1 || isBard == 1 || rogueSubclassArcaneTrickster == 1 || fighterSubclassEldritchKnight == 1 || isWarlock == 1) {
							spellsList.push(spell.definition.name)
	
							newPower.castingTime = getCastingTime(spell)
							newPower.components = getComponentString(spell)
	
							newPower.group = "Spells"
				
							// Set spell level
						newPower.level = spell.definition.level
						newPower.name = spell.definition.name

						// Set spell range
						if(spell.definition.range.origin == "Ranged"){
							newPower.range = spell.definition.range.rangeValue
						} else if (spell.definition.range.origin == "Touch") {
							newPower.range = "Touch"
						} else if (spell.definition.range.origin == "Self") {
							newPower.range = "Self"
						}

						if(spell.definition.duration.durationType == "Time") {
							newPower.duration = spell.definition.duration.durationInterval + " " + spell.definition.duration.durationUnit
						} else if(spell.definition.duration.durationType == "Instantaneous") {
							newPower.duration = "Instantaneous"
						}
					
						// Set spell school
						newPower.school = fixQuote(spell.definition.school)
						newJSON['powers'][`${newPower.name}`] = newPower
						}
					}
				});
			}
		}
	});
	//#endregion

	//#region addspeed
	if (isBarbarian == 1 && levelBarbarian >= 5 && usingHeavyArmor < 1) {
        addSpeed += 10;
    }

	charWalk = parseInt(character.race.weightSpeeds.normal.walk) + addSpeed;
	//#endregion

	//#region baseHitPoints
	character.race.racialTraits.some(function(current_trait) {
        if(current_trait.definition.name == "Dwarven Toughness") {
            addHP = totalLevels;
        }
    });
	character.feats.some(function(current_feat) {
        if (current_feat.definition.name == "Tough") {
            addHP += (totalLevels * 2);
        }
    });
	if(isSorcerer == 1 && sorcererOrigin.match(/Draconic\sBloodline/)) {
        // Draconic Resilience adds 1 to HP
        addHP += levelSorcerer;
    }
	if (character.preferences.hitPointType == "2") {
        totalHP = character.baseHitPoints + + ((Math.floor((getTotalAbilityScore(character, 3) - 10 ) / 2) * totalLevels))
    } else {
        totalHP = addHP + sumHP + Math.floor((getTotalAbilityScore(character, 3) - 10 ) / 2) * totalLevels;
    }

	newJSON['hp'] = {
		deathSaveFail: 0,
		deathSaveSuccess: 0,
		totalHP: 0
	}

	newJSON['hp'].deathSaveFail = (character.deathSaves.failCount == null) ? 0 : character.deathSaves.failCount
	newJSON['hp'].deathSaveSuccess = (character.deathSaves.successCount == null) ? 0 : character.deathSaves.successCount
	newJSON['hp'].totalHP = totalHP
	//#endregion

	//#region languages
	var languages = getObjects(character, 'type', 'language');
	newJSON['languages'] = [

	]
    languages.some(function(current_lang) {
        newJSON['languages'].push(capitalizeFirstLetter(current_lang.subType))
    });
	//#endregion

	let newJSONString = JSON.stringify(newJSON)

	fs.writeFileSync(path.resolve(`./charactersheets/parsed/${charid}.json`), newJSONString)
}
//#endregion

module.exports = {
	getAvatarURL: getAvatarURL,
	createNewCharacter: createNewCharacter,
	updateCharacter: updateCharacter,
	getCharacterName: getCharacterName,
	getCharacterNamesAndIds: getCharacterNamesAndIds,
	doesCharacterExist: doesCharacterExist,
	removeCharacter: removeCharacter,
	getCharacterOwner: getCharacterOwner,
	createNewJson: createNewJson,
	resetCharacterData: resetCharacterData,
	getParsedCharacterJson: getParsedCharacterJson,
	getHighestLevelClass: getHighestLevelClass,
	capitalizeFirstLetter: capitalizeFirstLetter,
	getStringOfLanguages: getStringOfLanguages,
	getCurrentTurn: getCurrentTurn,
	setTimerLength: setTimerLength,
	getCurrentTimerLength: getCurrentTimerLength,
	getAllClasses: getAllClasses,
	getRace: getRace,
	getAllAbilities: getAllAbilities,
	getCharacterOwnerShortName: getCharacterOwnerShortName,
	getCharacterOwnerFullName: getCharacterOwnerFullName
}