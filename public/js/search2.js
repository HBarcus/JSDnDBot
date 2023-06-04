const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
// const searchCharID = document.querySelector('#characterID')
// const searchCharName = document.querySelector('#characterName')
// const action = document.querySelector('#action')
// const charDiv = document.querySelector('#charid')
// const charNameDiv = document.querySelector('#charname')
// const charListDiv = document.querySelector('#characterList')

// search
// Was in
// document.addEventListener("DOMContentLoaded", (e) => {
// 	charNameDiv.style.display = 'none';
// })

// Was in
// searchCharID.addEventListener('change', (e) => {
// 	let matchingChars = []
// 	fetch('http://domain.com/characterlist').then((response) => {
// 		response.json().then((data) => {
// 			if (data.error) {
// 				console.log(data.error)
// 			} else {
// 				data.forEach((character) => {
// 					if(`${character.id}.includes(${searchCharID.value})`) {
// 						matchingChars.push(character.id)
// 					}
// 				})
// 			}
// 		})
// 	}).then(() => {
// 		matchingChars.forEach((character) => {

// 		})
// 	})
// })

// playerDiv.addEventListener('load', (e) => {
// 	playerDiv.style.display = 'none';
// })

// Was in
// action.addEventListener('change', (e) => {
// 	e.preventDefault()

// 	if (action.value == 'characterID') {
// 		charDiv.style.display = 'block';
// 		charNameDiv.style.display = 'none';
// 	} else {
// 		charDiv.style.display = 'none';
// 		charNameDiv.style.display = 'block';
// 	}

// })

// $(document).ready(function(){

// 	$('#action').on('change', function () {
// 		if (this.value == 'characterID') {
// 			$("#charid").show();
// 			$("#playerName").hide();
// 		} else {
// 			$("#charid").hide();
// 			$("#playerName").show();
// 		}
// 	});
// });

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = searchInput.value;

  window.location.replace(`http://domain.com/character/${searchTerm}`);

  // fetch('http://domain.com/characterlist').then((response) => {
  // 	response.json().then((data) => {
  // 		if (data.error) {
  // 			// console.log(data.error)
  // 		} else {
  // 			data.forEach((character) => {
  // 				console.log(`${character.id}: ${character.name}`)
  // 			})
  // 		}
  // 	})
  // })

  console.log(searchTerm);
});
