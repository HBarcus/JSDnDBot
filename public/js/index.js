// const characterParagraph = document.getElementById('charList')

// let characterList = []
// let finalHTMLString = '<table><tr><th> </th><th>ID</th><th>Name</th><th>Owner Discord ID</th><th>Checked in</th></tr>'

// fetch('http://domain.com/characterlist').then((response) => {
// 	response.json().then((data) => {
// 		if (data.error) {
// 			// console.log(data.error)
// 		} else {
// 			// let currentCharacterNumber = 0
// 			data.forEach((character) => {
// 				characterList.push(character)
// 				finalHTMLString += `<tr>`
// 				finalHTMLString += `<td><input type ="checkbox" id="${character.id} name="${character.name} data-owner="${character.owner}" value="${character.id}"`
// 				if(character.checkedin == 'true') {
// 					finalHTMLString += `checked`
// 				}
// 				finalHTMLString += `></td>`
// 				finalHTMLString += `<td>${character.id}</td>`
// 				finalHTMLString += `<td>${character.name}</td>`
// 				finalHTMLString += `<td>${character.owner}</td>`
// 				if(character.checkedin == 'true') {
// 					finalHTMLString += `<td>Yes</td>`
// 				} else {
// 					finalHTMLString += `<td>No</td>`
// 				}
// 				finalHTMLString += `</tr>`
// 				// finalHTMLString += `<input type ="checkbox" id="${character.id} name="${character.id} value="${character.id}">`
// 				// finalHTMLString += `<label for="${character.id}"> ${character.id}: ${character.name} </label><br>`
// 				// finalHTMLString += `${character.id}: ${character.name}<br>`
// 			})
// 			finalHTMLString += `</table>`
// 			characterParagraph.innerHTML = finalHTMLString
// 		}
// 	})
// })

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
