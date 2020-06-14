var psl = document.getElementById("playerSelectLeft");
var psr = document.getElementById("playerSelectRight");
var spriteImage = document.getElementById("spriteImage");

const pathToSpriteAssets = "assets/playerSprites/svg/"
var chosenSprite = 1;


psl.addEventListener("click", function() {
    changePlayer("left")
});

psr.addEventListener("click", function() {
    changePlayer("right")
});

function generatePathToSprite() {
    var fileName = chosenSprite.toString() + ".svg"
    return pathToSpriteAssets + fileName
}

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