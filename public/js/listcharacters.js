const characterParagraph = document.getElementById("charList");
const playerCheckInPath = "/home/ubuntu/environment/discordbot/utilities/datajsons/playerCheckInList.json";

let characterList = [];
let finalHTMLString = '<table class="listtable"><tr><th class="infotablecell">ID</th><th>Name</th><th class="infotablecell">Owner Discord</th><th>Checked in</th></tr>';

fetch("http://domain.com/characterlist").then((response) => {
  response.json().then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      data.forEach((character) => {
        characterList.push(character);
        finalHTMLString += `<tr>`;
        finalHTMLString += `<td class="infotablecell">${character.id}</td>`;
        finalHTMLString += `<td class="infotablecell"><a href="http://domain.com/character/${character.id}">${character.name}</a></td>`;
        finalHTMLString += `<td class="infotablecell">${character.ownerName}</td>`;
        if (character.checkedin == "true") {
          finalHTMLString += `<td class="infotablecell">Yes</td>`;
        } else {
          finalHTMLString += `<td class="infotablecell">No</td>`;
        }
        finalHTMLString += `</tr>`;
      });
      finalHTMLString += `</table>`;
      characterParagraph.innerHTML = finalHTMLString;
    }
  });
});
