var spb = document.getElementById("singlePlayerButton");
spb.addEventListener("click", singlePlayer)

function singlePlayer() {
    // Store gameMode in local storage
    // Direct to player choice screen
    localStorage.setItem("gameMode", "single");

    window.location = "./playerSelection.html"
}