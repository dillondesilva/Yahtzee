var returnButton = document.getElementById("returnButton");
var playerOneName = localStorage.getItem("playerOneName");
var playerOneTable = document.getElementById("playerOneTable");
var playerTwoTable = document.getElementById("playerTwoTable");
playerOneTable.innerText = playerOneName;

const gameMode = localStorage.getItem("gameMode");
const pathToSpriteAssets = "assets/playerSprites/svg/";
const pathToDiceAssets = "assets/externalSprites/";
const diceOptions = ["A", "B", "C", "D", "E", "F"];

// Getting dice elements
var diceA = document.getElementById("diceA");
var diceB = document.getElementById("diceB");
var diceC = document.getElementById("diceC");
var diceD = document.getElementById("diceD");
var diceE = document.getElementById("diceE");

// Configuring scoring cells for the upper house
var upperHouseScores = {
    ones: [true, 0], 
    twos: [true, 0],
    threes: [true, 0],
    fours: [true, 0],
    fives: [true, 0],
    sixes: [true, 0],
    total: 0
}

var lowerHouseScores = {
    threeKind: [true, 0], 
    fourKind: [true, 0],
    smallStraight: [true, 0],
    largeStraight: [true, 0],
    yahtzee: [true, 0],
    chance: [true, 0]
}

var total = 0;

// Getting cell elements for scores 
var onesCellPlayerOne = document.getElementById("onesPlayerOne");
var twosCellPlayerOne = document.getElementById("twosPlayerOne");
var threesCellPlayerOne = document.getElementById("threesPlayerOne");
var foursCellPlayerOne = document.getElementById("foursPlayerOne");
var fivesCellPlayerOne = document.getElementById("fivesPlayerOne");
var sixesCellPlayerOne = document.getElementById("sixesPlayerOne");

var threeKCellPlayerOne = document.getElementById("threeKindPlayerOne");

// Configuring dice to handle clicks
diceA.addEventListener("click", () => {
    diceClicked(0);
});

diceB.addEventListener("click", () => {
    diceClicked(1);
});

diceC.addEventListener("click", () => {
    diceClicked(2);
});

diceD.addEventListener("click", () => {
    diceClicked(3)
});

diceE.addEventListener("click", () => {
    diceClicked(4)
});

// Configuring dice Images
var diceAImage = new Image(40, 40);
var diceBImage = new Image(40, 40);
var diceCImage = new Image(40, 40);
var diceDImage = new Image(40, 40);
var diceEImage = new Image(40, 40);

// Getting Player Image Elements to Change
var playerOneImage = document.getElementById("playerOneImage");
var playerTwoImage = document.getElementById("playerTwoImage");

var rollButton = document.getElementById("rollButton");
rollButton.addEventListener("click", () => rollDice());

// Array which represents the state of each die being held
// or ready to roll
var diceHeldStates = [false, false, false, false, false];
var diceValues = [1, 2, 3, 4, 5];
var diceFrequency = [0, 0, 0, 0, 0, 0]

setup();
function setup() {
   if (gameMode === "single") {
        playerTwoTable.innerText = "CPU";
   }
   configureDice();
   configurePlayerSprites();
}

function rollDice() {
    var diceToRoll = getDiceToRoll();
    var diceElements = [];
    for (var die = 0; die < diceToRoll.length; die++) {
        var diceElement = getDiceFromIndex(diceToRoll[die]);
        diceElements.push(diceElement);
    }

    var diceRollInterval = setInterval(() => {
        for (var die = 0; die < diceToRoll.length; die++) {
            var diceImage = new Image(60, 60);
            var diceData =  generatePathToDie();
            diceImage.src = diceData[0];
            diceElements[die].src = diceImage.src;
            diceValues[diceToRoll[die]] = diceData[1]; 
        }
    }, 100);

    setTimeout(() => {
        clearInterval(diceRollInterval);
        calculateDiceFrequency();
        allocateAvailableScores();
    }, 3000)
}

function validateOnes() {
    var onesData = upperHouseScores["ones"];
    var onesAvailable = onesData[0];
    if (onesAvailable) {
        if (diceValues.includes(1)) {
            var onesScore = 0;
            for (i of diceValues) {
                if (i === 1) {
                    onesScore += 1;
                }
            }
    
            onesCellPlayerOne.innerHTML = onesScore;
            onesCellPlayerOne.style.backgroundColor = "#50c878";
            onesCellPlayerOne.style.webkitAnimationName = 'animateCell';
            onesCellPlayerOne.style.webkitAnimationDuration = '1s';
            onesCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            onesCellPlayerOne.addEventListener("click", () => {
                total += onesScore;
                upperHouseScores["ones"] = [false, onesScore];
                onesCellPlayerOne.style.backgroundColor = "white"; 
                onesCellPlayerOne.style.opacity = 1;
                onesCellPlayerOne.style.webkitAnimationName = '';
                onesCellPlayerOne.style.webkitAnimationDuration = '';
            }) 
        } else {
            onesCellPlayerOne.innerHTML = "";
            onesCellPlayerOne.style.opacity = 1;
            onesCellPlayerOne.style.backgroundColor = "white"; 
            onesCellPlayerOne.style.webkitAnimationName = '';
            onesCellPlayerOne.style.webkitAnimationDuration = '';
        }
    }
}

function validateTwos() {
    var twosData = upperHouseScores["twos"];
    var twosAvailable = twosData[0];
    if (twosAvailable) {
        if (diceValues.includes(2)) {
            var twosScore = 0;
            for (i of diceValues) {
                if (i === 2) {
                    twosScore += 2;
                }
            }
    
            twosCellPlayerOne.innerHTML = twosScore;
            twosCellPlayerOne.style.backgroundColor = "#50c878";
            twosCellPlayerOne.style.webkitAnimationName = 'animateCell';
            twosCellPlayerOne.style.webkitAnimationDuration = '1s';
            twosCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            twosCellPlayerOne.addEventListener("click", () => {
                total += twosScore;
                upperHouseScores["twos"] = [false, twosScore];
                twosCellPlayerOne.style.backgroundColor = "white"; 
                twosCellPlayerOne.style.opacity = 1;
                twosCellPlayerOne.style.webkitAnimationName = '';
                twosCellPlayerOne.style.webkitAnimationDuration = '';
            }) 
        } else {
            twosCellPlayerOne.innerHTML = "";
            twosCellPlayerOne.style.opacity = 1;
            twosCellPlayerOne.style.backgroundColor = "white"; 
            twosCellPlayerOne.style.webkitAnimationName = '';
            twosCellPlayerOne.style.webkitAnimationDuration = '';
        }

    }
}


function validateThrees() {
    var threesData = upperHouseScores["threes"];
    var threesAvailable = threesData[0];
    if (threesAvailable) {
        if (diceValues.includes(3)) {
            var threesScore = 0;
            for (i of diceValues) {
                if (i === 3) {
                    threesScore += 3;
                }
            }
    
            threesCellPlayerOne.innerHTML = threesScore;
            threesCellPlayerOne.style.backgroundColor = "#50c878";
            threesCellPlayerOne.style.webkitAnimationName = 'animateCell';
            threesCellPlayerOne.style.webkitAnimationDuration = '1s';
            threesCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            threesCellPlayerOne.addEventListener("click", () => {
                total += threesScore;
                upperHouseScores["threes"] = [false, threesScore];
                threesCellPlayerOne.style.backgroundColor = "white"; 
                threesCellPlayerOne.style.opacity = 1;
                threesCellPlayerOne.style.webkitAnimationName = '';
                threesCellPlayerOne.style.webkitAnimationDuration = '';
            })
        } else {
            threesCellPlayerOne.innerHTML = "";
            threesCellPlayerOne.style.opacity = 1;
            threesCellPlayerOne.style.backgroundColor = "white"; 
            threesCellPlayerOne.style.webkitAnimationName = '';
            threesCellPlayerOne.style.webkitAnimationDuration = '';
        }
    }
}

function validateFours() {
    var foursData = upperHouseScores["fours"];
    var foursAvailable = foursData[0];
    if (foursAvailable) {
        if (diceValues.includes(4)) {
            var foursScore = 0;
            for (i of diceValues) {
                if (i === 4) {
                    foursScore += 4;
                }
            }
    
            foursCellPlayerOne.innerHTML = foursScore;
            foursCellPlayerOne.style.backgroundColor = "#50c878";
            foursCellPlayerOne.style.webkitAnimationName = 'animateCell';
            foursCellPlayerOne.style.webkitAnimationDuration = '1s';
            foursCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            foursCellPlayerOne.addEventListener("click", () => {
                total += foursScore;
                upperHouseScores["fours"] = [false, foursScore];
                foursCellPlayerOne.style.backgroundColor = "white"; 
                foursCellPlayerOne.style.opacity = 1;
                foursCellPlayerOne.style.webkitAnimationName = '';
                foursCellPlayerOne.style.webkitAnimationDuration = '';
            })
        } else {
            foursCellPlayerOne.innerHTML = "";
            foursCellPlayerOne.style.opacity = 1;
            foursCellPlayerOne.style.backgroundColor = "white"; 
            foursCellPlayerOne.style.webkitAnimationName = '';
            foursCellPlayerOne.style.webkitAnimationDuration = '';
        }
    }
}


function validateFives() {
    var fivesData = upperHouseScores["fives"];
    var fivesAvailable = fivesData[0];
    if (fivesAvailable) {
        if (diceValues.includes(5)) {
            var fivesScore = 0;
            for (i of diceValues) {
                if (i === 5) {
                    fivesScore += 5;
                }
            }
    
            fivesCellPlayerOne.innerHTML = fivesScore;
            fivesCellPlayerOne.style.backgroundColor = "#50c878";
            fivesCellPlayerOne.style.webkitAnimationName = 'animateCell';
            fivesCellPlayerOne.style.webkitAnimationDuration = '1s';
            fivesCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            fivesCellPlayerOne.addEventListener("click", () => {
                total += fivesScore;
                upperHouseScores["fives"] = [false, fivesScore];
                fivesCellPlayerOne.style.backgroundColor = "white"; 
                fivesCellPlayerOne.style.opacity = 1;
                fivesCellPlayerOne.style.webkitAnimationName = '';
                fivesCellPlayerOne.style.webkitAnimationDuration = '';
            }) 
        } else {
            fivesCellPlayerOne.innerHTML = "";
            fivesCellPlayerOne.style.opacity = 1;
            fivesCellPlayerOne.style.backgroundColor = "white"; 
            fivesCellPlayerOne.style.webkitAnimationName = '';
            fivesCellPlayerOne.style.webkitAnimationDuration = '';
        }
        
    }
}


function validateSixes() {
    var sixesData = upperHouseScores["sixes"];
    var sixesAvailable = sixesData[0];
    if (sixesAvailable) {
        if (diceValues.includes(6)) {
            var sixesScore = 0;
            for (i of diceValues) {
                if (i === 6) {
                    sixesScore += 6;
                }
            }
    
            sixesCellPlayerOne.innerHTML = sixesScore;
            sixesCellPlayerOne.style.backgroundColor = "#50c878";
            sixesCellPlayerOne.style.webkitAnimationName = 'animateCell';
            sixesCellPlayerOne.style.webkitAnimationDuration = '1s';
            sixesCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            sixesCellPlayerOne.addEventListener("click", () => {
                total += sixesScore;
                upperHouseScores["sixes"] = [false, sixesScore];
                sixesCellPlayerOne.style.backgroundColor = "white"; 
                sixesCellPlayerOne.style.opacity = 1;
                sixesCellPlayerOne.style.webkitAnimationName = '';
                sixesCellPlayerOne.style.webkitAnimationDuration = '';
            }) 
        } else {
            sixesCellPlayerOne.innerHTML = "";
            sixesCellPlayerOne.style.opacity = 1;
            sixesCellPlayerOne.style.backgroundColor = "white"; 
            sixesCellPlayerOne.style.webkitAnimationName = '';
            sixesCellPlayerOne.style.webkitAnimationDuration = '';
        }
    }
}

function validateThreeOfAKind() {
    var threeKindData = lowerHouseScores["threeKind"];
    var threeKindAvailable = threeKindData[0]; 

    if (threeKindAvailable) {
        if (diceFrequency.includes(3)) {
            var threeKindScore = 0;
            for (i of diceValues) {
                threeKindScore += i;
            }
    
            threeKCellPlayerOne.innerHTML = threeKindScore;
            threeKCellPlayerOne.style.backgroundColor = "#50c878";
            threeKCellPlayerOne.style.webkitAnimationName = 'animateCell';
            threeKCellPlayerOne.style.webkitAnimationDuration = '1s';
            threeKCellPlayerOne.style.webkitAnimationIterationCount = 'infinite';
            threeKCellPlayerOne.addEventListener("click", () => {
                total += threeKScore;
                lowerHouseScores["threeKind"] = [false, threeKindScore];
                threeKCellPlayerOne.style.backgroundColor = "white"; 
                threeKCellPlayerOne.style.opacity = 1;
                threeKCellPlayerOne.style.webkitAnimationName = '';
                threeKCellPlayerOne.style.webkitAnimationDuration = '';
            }) 
        } else {
            threeKCellPlayerOne.innerHTML = "";
            threeKCellPlayerOne.style.opacity = 1;
            threeKCellPlayerOne.style.backgroundColor = "white"; 
            threeKCellPlayerOne.style.webkitAnimationName = '';
            threeKCellPlayerOne.style.webkitAnimationDuration = '';
        } 
    }
}

// Decides whether certain scoring cells can be selected or
// not
function allocateAvailableScores() {
    // Upper house scores to validate
    validateOnes();
    validateTwos();
    validateThrees();
    validateFours();
    validateFives();
    validateSixes();

    // Lower house scores to validate
    validateThreeOfAKind();
}

function getDiceToRoll() {
    var diceToRoll = [];
    for(var die = 0; die < diceHeldStates.length; die++) {
        if (!diceHeldStates[die]) {
            diceToRoll.push(die); 
        }
    }

    return diceToRoll;
}

function configurePlayerSprites() {
    var playerOneImg = localStorage.getItem("playerOneImage");
    var spriteImage = new Image(60, 60);
    spriteImage.src = playerOneImg;
    playerOneImage.src = spriteImage.src;

    if (gameMode === "multiplayer") {
        var playerTwoImg = localStorage.getItem("playerTwoImage");
        spriteImage = new Image(60, 60);
        spriteImage.src = playerTwoImg;
        playerTwoImage.src = spriteImage.src;
    } else {
        spriteImage = new Image(60, 60);
        var randomPlayer = generateRandomPlayerSprite();
        spriteImage.src = randomPlayer
        playerTwoImage.src = spriteImage.src
    }
}

function generateRandomPlayerSprite() {
    var randomSprite = Math.floor(Math.random() * Math.floor(10)) + 1
    var fileName = randomSprite.toString() + ".svg"
    return pathToSpriteAssets + fileName
}

function getDiceFromIndex(diceNum) {
    var diceLabel = diceOptions[diceNum];
    var diceElement;
    switch (diceLabel) {
        case "A":
            diceElement = diceA;
            break;
        case "B":
            diceElement = diceB;
            break;
        case "C":
            diceElement = diceC;
            break;
        case "D":
            diceElement = diceD;
            break;
        case "E":
            diceElement = diceE;
            break;
    }

    return diceElement;
}

function diceClicked(diceNum) {
    diceHeldStates[diceNum] = !diceHeldStates[diceNum];
    var diceLabel = diceOptions[diceNum];
    var diceElement;
    switch (diceLabel) {
        case "A":
            diceElement = diceA;
            break;
        case "B":
            diceElement = diceB;
            break;
        case "C":
            diceElement = diceC;
            break;
        case "D":
            diceElement = diceD;
            break;
        case "E":
            diceElement = diceE;
            break;
    }
    if (diceHeldStates[diceNum]) {
        diceElement.style.top = "400px";
    } else {
        diceElement.style.top = "280px"; 
    }
}

function generatePathToDie() {
    var diceVal = Math.floor(Math.random() * 6);
    var randomValue = diceOptions[diceVal];
    var fileName = "dice" + randomValue + ".svg";
    return [pathToDiceAssets + fileName, diceVal + 1];
}

function configureDice() {
    var diceAData = generatePathToDie();
    diceAImage.src = diceAData[0];
    diceA.src = diceAImage.src;
    diceValues[0] = diceAData[1];

    var diceBData = generatePathToDie();
    diceBImage.src = diceBData[0];
    diceB.src = diceBImage.src;
    diceValues[1] = diceBData[1];

    var diceCData = generatePathToDie();
    diceCImage.src = diceCData[0];
    diceC.src = diceCImage.src;
    diceValues[2] = diceCData[1]; 

    var diceDData = generatePathToDie();
    diceDImage.src = diceDData[0];
    diceD.src = diceDImage.src;
    diceValues[3] = diceDData[1];

    var diceEData = generatePathToDie();
    diceEImage.src = diceEData[0];
    diceE.src = diceEImage.src;
    diceValues[4] = diceEData[1];

    calculateDiceFrequency();
}

var playerOneTable = document.getElementById("playerOneTable");
playerOneTable.innerText = playerOneName;

returnButton.addEventListener("click", function () {
    swal({
        title: "Warning!",
        text: "Are you sure you want to quit? Your progress is not saved.",
        icon: "warning",
        buttons: {
            quit: {
              text: "Quit",
              value: "quit",
            },
            cancel: "Cancel"
        }
    })
    .then((value) => {
        if (value === "quit") {
            window.location = "./index.html";
            localStorage.clear(); 
        } else {
            swal.close();
        }
    })
});

function calculateDiceFrequency() {
    diceFrequency = [0, 0, 0, 0, 0, 0]
    for (die of diceValues) {
        diceFrequency[die - 1] += 1;
    }
}