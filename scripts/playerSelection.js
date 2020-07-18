var psl = document.getElementById("playerSelectLeft");
var psr = document.getElementById("playerSelectRight");
var spriteImage = document.getElementById("spriteImage");

const pathToSpriteAssets = "assets/playerSprites/svg/";
var chosenSprite = 1;


psl.addEventListener("click", function() {
    changePlayer("left")
});

psr.addEventListener("click", function() {
    changePlayer("right")
});

var returnButton = document.getElementById("returnButton");

returnButton.addEventListener("click", function () {
    window.location = "./index.html";
    localStorage.clear();
});

function generatePathToSprite() {
    var fileName = chosenSprite.toString() + ".svg"
    return pathToSpriteAssets + fileName
}

// Handles player changes when either the playerSelectLeft
// or playerSelectRight button is pressed.
function changePlayer(direction) {
    var newSprite = new Image(180, 180); 

    if (direction == "left") {
        switch(chosenSprite) {
            case 1:
                chosenSprite = 10;
                break;
            default:
                chosenSprite -= 1;
                break
        }

        newSprite.src = generatePathToSprite();
    } else {
        switch(chosenSprite) {
            case 10:
                chosenSprite = 1;
                break;
            default:
                chosenSprite += 1;
                break;
        }
        
        newSprite.src = generatePathToSprite();
    }

    spriteImage.src = newSprite.src;
}

var playerName = document.getElementById("playerNameInput");

// Submitting a player into localStorage
var playerReady = document.getElementById("playerReadyButton");
playerReady.addEventListener("click", savePlayerDetails);

// savePlayerDetails() saves a player into localStorage and also 
// handles behaviour for if in Multiplayer
function savePlayerDetails() {
    const gameMode = localStorage.getItem("gameMode");
    const playerImage = generatePathToSprite();
    if (gameMode === "single") {
        localStorage.setItem("playerOneName", playerName.value);
        localStorage.setItem("playerOneImage", playerImage);
        window.location = "./gameView.html"
    }
}