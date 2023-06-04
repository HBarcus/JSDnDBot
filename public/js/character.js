const characterParagraph = document.getElementById("charinfolist");

let finalHTMLString = "";

let thisurl = window.location.href;
var urlArr = thisurl.split("/");
var charid = urlArr[urlArr.length - 1];

fetch(`http://domain.com/characterinfo/${charid}`).then((response) => {
  response.json().then((data) => {
    if (data.error) {
      // console.log(data.error)
    } else {
      // console.log(data)
      // let currentCharacterNumber = 0
      // data.forEach((character) => {
      // if (character.id == charid){
      // finalHTMLString += `<p><b>${data.characterName}</b></p>`
      let classesString = "";
      // finalHTMLString += `<table class="noborder"><tr><td class ="lesspadding">`
      finalHTMLString += `<table class="noborder" background="https://www.dndbeyond.com/content/1-0-1854-0/skins/waterdeep/images/background_texture.png" border-radius="10px"><tr><td class ="lesspadding">`;
      // finalHTMLString += `<table class="noborder" bgcolor="#fdf9d3" border-radius="10px"><tr><td class ="lesspadding">`
      data.classInfo.forEach((charClass) => {
        classesString += `Level ${charClass.classLevel} ${charClass.className[0].toUpperCase()}${charClass.className.substring(1)}<br>`;
      });

      finalHTMLString += `<table class="infotable" id='maintable'>`;
      finalHTMLString += `<tr valign=top>`;

      finalHTMLString += `<td class="infotablecell" colspan="2">`;
      finalHTMLString += `<b><h2><u style="text-decoration-color:#DA0000">${data.characterName}</u></h2></b>`;

      finalHTMLString += `<p style="font-size:12px"><i>Owned by <a href="https://discord.gg/user/${data.ownerFullName}">${data.ownerFullName}</a></i></p>`;

      if (data.alignment.includes("Good")) {
        finalHTMLString += `<b><p style="color: green;"><u style="text-decoration: none;border-bottom: 2px solid green;">${data.alignment}</u></p></b>`;
      } else if (data.alignment.includes("Evil")) {
        finalHTMLString += `<b><p style="color: darkred;"><u style="text-decoration: none;border-bottom: 2px solid darkred;">${data.alignment}</u></p></b>`;
      } else {
        finalHTMLString += `<b><p><u style="text-decoration: none;border-bottom: 2px solid black;">${data.alignment}</u></p></b>`;
      }

      finalHTMLString += `<p><b>${classesString}</b></p>`;
      finalHTMLString += `</td>`;

      finalHTMLString += `<td class="infotablecell" align=right>`;
      finalHTMLString += `<img class="avatarimage" id="avatarimage" src="${data.avatarURL}" height="150">`;
      finalHTMLString += `</td>`;
      finalHTMLString += `</tr>`;

      finalHTMLString += `<tr valign=top>`;

      let currentAbilityCount = 0;

      let abilityArr = data.abilityInfo;

      data.abilityInfo.forEach((ability) => {
        if (currentAbilityCount == 3) {
          finalHTMLString += `</tr>`;
          finalHTMLString += `<tr valign=top>`;
        }

        if (currentAbilityCount < 3) {
          finalHTMLString += `<td class="topbordercell">`;
        } else {
          finalHTMLString += `<td class="statcell">`;
        }

        if (currentAbilityCount == 0 || currentAbilityCount == 3) {
          finalHTMLString += `<div id="rectangleleft">`;
        } else if (currentAbilityCount == 2 || currentAbilityCount == 5) {
          finalHTMLString += `<div id="rectangleright" align="right">`;
        } else {
          finalHTMLString += `<div id="rectangle">`;
        }

        // finalHTMLString += `<div id="rectangle">`

        finalHTMLString += `<center><b>${ability.name[0].toUpperCase()}${ability.name.substring(1)}: </b><br>`;
        finalHTMLString += `Score: ${ability.score}<br>`;
        finalHTMLString += `Modifier: ${ability.modifier}<br>`;
        finalHTMLString += `Proficiency: ${ability.saveProf == true ? "Yes" : "No"}<br></center>`;
        finalHTMLString += `</div></td>`;
        currentAbilityCount++;
      });

      finalHTMLString += `<tr valign=top>`;
      finalHTMLString += `<td class="topbordercell" colspan="5">`;
      finalHTMLString += `<p><b>${data.backgroundTitle}:</b><br>`;
      finalHTMLString += `${data.backgroundDesc}</p>`;
      finalHTMLString += `</tr><tr valign=top><td class="topbordercell" colspan="5">`;
      finalHTMLString += `<p><b>Languages:</b><br>`;
      data.languageArr.forEach((language) => {
        finalHTMLString += `${language}<br>`;
      });
      finalHTMLString += "</p>";
      finalHTMLString += `</td>`;
      finalHTMLString += `</tr>`;
      finalHTMLString += `</td>`;
      finalHTMLString += `</tr>`;
      finalHTMLString += `</table>`;
      finalHTMLString += `</table>`;

      // finalHTMLString += `<p><h2>${data.characterName}</h2>`
      // finalHTMLString += `<img src="${data.avatarURL}"></p>`
      // finalHTMLString += `<p>${data.alignment}</p>`
      // finalHTMLString += `<p>`
      // data.classInfo.forEach((charClass) => {
      // 	finalHTMLString += `Level ${charClass.classLevel} ${charClass.className[0].toUpperCase()}${charClass.className.substring(1)}<br>`
      // })
      // finalHTMLString += `<p><b>${data.backgroundTitle}:</b><br>`
      // finalHTMLString += `${data.backgroundDesc}</p>`
      // finalHTMLString += `<p><b>Languages:</b><br>`
      // data.languageArr.forEach((language) => {
      // 	finalHTMLString += `${language}<br>`
      // })
      // finalHTMLString += '</p>'
      // console.log(finalHTMLString)
      // }

      // finalHTMLString += `<td><input type ="checkbox" id="${character.id} name="${character.name} data-owner="${character.owner}" value="${character.id}"`
      // if(character.checkedin == 'true') {
      // 	finalHTMLString += `checked`
      // }
      // finalHTMLString += `></td>`
      // finalHTMLString += `<td>${character.id}</td>`
      // finalHTMLString += `<td>${character.name}</td>`
      // finalHTMLString += `<td>${character.owner}</td>`
      // if(character.checkedin == 'true') {
      // 	finalHTMLString += `<td>Yes</td>`
      // } else {
      // 	finalHTMLString += `<td>No</td>`
      // }
      // finalHTMLString += `</tr>`
      // finalHTMLString += `<input type ="checkbox" id="${character.id} name="${character.id} value="${character.id}">`
      // finalHTMLString += `<label for="${character.id}"> ${character.id}: ${character.name} </label><br>`
      // finalHTMLString += `${character.id}: ${character.name}<br>`
      // })
      // console.log(data)
      // finalHTMLString += `</table>`

      characterParagraph.innerHTML = finalHTMLString;
    }
  });
});

// const sheetTable = document.getElementById('maintable')
// let sheetWidth = sheetTable.offsetWidth;
// // let sheetHeight = sheetTable.offsetHeight;
// console.log('Width: ', sheetWidth)
// console.log('Height: ', sheetHeight)

// const characterForm = document.querySelector('form')

// // characterForm.addEventListener('submit', (e) => {
// // 	e.preventDefault()
// // 	let checkboxes = document.querySelectorAll("input[type=checkbox]")
// // 	let checkedChars = []
// // 	checkboxes.forEach((checkbox) => {
// // 		if (checkbox.checked) {
// // 			const characterID = checkbox.id
// // 		}
// // 	})
// // 	// let selectedChars = document.querySelector('input').checked
// // 	console.log(checkedChars)
// // })
