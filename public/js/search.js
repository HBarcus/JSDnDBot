const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const testButton = document.querySelector("button");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = searchInput.value;

  fetch("http://domain.com/characterlist").then((response) => {
    response.json().then((data) => {
      if (data.error) {
      } else {
        data.forEach((character) => {
          if (character.name == searchTerm) {
            window.location.replace(`http://domain.com/character/${character.id}`);
          } else {
          }
        });
      }
    });
  });
});
