const fs = require('fs')
const path = require('path');
const dataJson = path.resolve('./utilities/datajsons/data.json')
const turnListPath = path.resolve('./utilities/datajsons/turnList.json')
const checkInPath = path.resolve('./utilities/datajsons/playerCheckInList.json')
const jsonH = require(path.resolve('./utilities/newjsonhandler.js'));

const getCurrentTurnNumber = () => {
    let rawData = fs.readFileSync(dataJson)
    let json = JSON.parse(rawData)
    return json.currentTurn
}

const whoseTurnPlayerID = () => {
    const rawData = fs.readFileSync(path.resolve('./utilities/datajsons/turnList.json'), 'utf-8')
    const jsonData = JSON.parse(rawData)
    return jsonData[`${getCurrentTurnNumber()}`]
}

const whoseTurnName = () => {
    return jsonH.getCharacterName(`${whoseTurnPlayerID()}`)
}

const isCharacterCheckedIn = (characterid) => {
    let rawCheckin = fs.readFileSync(checkInPath)
    let jsonCheckin = JSON.parse(rawCheckin)
    if (jsonCheckin['checkedin'].includes(characterid)){
        return true
    } else {
        return false
    }
}

const incrementTurn = () => {
    let rawData = fs.readFileSync(dataJson)
    let turnJSON = JSON.parse(rawData)
    let currentTurn = turnJSON.currentTurn

    let rawTurnList = fs.readFileSync(turnListPath)
    let jsonTurnList = JSON.parse(rawTurnList)
    let totalPlayerCount = Object.keys(jsonTurnList).length

    do {
        if (currentTurn >= totalPlayerCount) {
            currentTurn = 1
        } else {
            currentTurn++
        }
    } while (!isCharacterCheckedIn(jsonTurnList[`${currentTurn}`]))

    turnJSON['currentTurn'] = currentTurn
    let stringify = JSON.stringify(turnJSON)
    fs.writeFileSync(dataJson, stringify)

    // console.log(currentTurn + ': ' + whoseTurnName())
}

module.exports = {
    whoseTurn: whoseTurnPlayerID,
    whoseTurnName: whoseTurnName,
    incrementTurn: incrementTurn,
    isCharacterCheckedIn: isCharacterCheckedIn
}