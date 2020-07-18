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
// and lower house (for each player)
var playerOneUpperHouseScores = {
    ones: [true, 0], 
    twos: [true, 0],
    threes: [true, 0],
    fours: [true, 0],
    fives: [true, 0],
    sixes: [true, 0],
    total: 0
}

var playerOneLowerHouseScores = {
    threeKind: [true, 0], 
    fourKind: [true, 0],
    smallStraight: [true, 0],
    largeStraight: [true, 0],
    yahtzee: [true, 0],
    chance: [true, 0]
}

var playerTwoUpperHouseScores = {
    ones: [true, 0], 
    twos: [true, 0],
    threes: [true, 0],
    fours: [true, 0],
    fives: [true, 0],
    sixes: [true, 0],
    total: 0
}

var playerTwoLowerHouseScores = {
    threeKind: [true, 0], 
    fourKind: [true, 0],
    smallStraight: [true, 0],
    largeStraight: [true, 0],
    yahtzee: [true, 0],
    chance: [true, 0]
}

var playerOneTotal = 0;
var playerTwoTotal = 0;
var diceRollsLeft = 3;
var currentPlayer = 1;

// Getting cell elements for scores 
var onesCellPlayerOne = document.getElementById("onesPlayerOne");
var twosCellPlayerOne = document.getElementById("twosPlayerOne");
var threesCellPlayerOne = document.getElementById("threesPlayerOne");
var foursCellPlayerOne = document.getElementById("foursPlayerOne");
var fivesCellPlayerOne = document.getElementById("fivesPlayerOne");
var sixesCellPlayerOne = document.getElementById("sixesPlayerOne");

var onesCellPlayerTwo = document.getElementById("onesPlayerTwo");
var twosCellPlayerTwo = document.getElementById("twosPlayerTwo");
var threesCellPlayerTwo = document.getElementById("threesPlayerTwo");
var foursCellPlayerTwo = document.getElementById("foursPlayerTwo");
var fivesCellPlayerTwo = document.getElementById("fivesPlayerTwo");
var sixesCellPlayerTwo = document.getElementById("sixesPlayerTwo");

var threeKCellPlayerOne = document.getElementById("threeKindPlayerOne");
var fourKCellPlayerOne = document.getElementById("fourKindPlayerOne");

var threeKCellPlayerTwo = document.getElementById("threeKindPlayerTwo");
var fourKCellPlayerTwo = document.getElementById("fourKindPlayerTwo");

var allCells = [
    onesCellPlayerOne, twosCellPlayerOne, threesCellPlayerOne,
    foursCellPlayerOne, fivesCellPlayerOne, sixesCellPlayerOne,
    onesCellPlayerTwo, twosCellPlayerTwo, threesCellPlayerTwo,
    foursCellPlayerTwo, fivesCellPlayerTwo, sixesCellPlayerTwo,
    threeKCellPlayerOne, fourKCellPlayerOne, threeKCellPlayerTwo,
    fourKCellPlayerTwo
]

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

function switchPlayer() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
    } else {
        currentPlayer = 1;
    }

    diceRollsLeft = 3;
    configureDice();
}

function validateOnes() {
    var onesData;
    var onesAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = onesCellPlayerOne; 
        onesData = playerOneUpperHouseScores["ones"];
        onesAvailable = onesData[0]; 
    } else {
        playerScoreCell = onesCellPlayerTwo;  
        onesData = playerTwoUpperHouseScores["ones"];
        onesAvailable = onesData[0]; 
    }

    if (onesAvailable) {
        if (diceValues.includes(1)) {
            var onesScore = 0;
            for (i of diceValues) {
                if (i === 1) {
                    onesScore += i;  
                }
            }

            enableAnimation(playerScoreCell, onesScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["ones"] = [false, onesScore];
                    playerOneTotal += onesScore
                } else {
                    playerTwoUpperHouseScores["ones"] = [false, onesScore];
                    playerTwoTotal += onesScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);

                fixScore(playerScoreCell, onesScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateTwos() {
    var twosData;
    var twosAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = twosCellPlayerOne; 
        twosData = playerOneUpperHouseScores["twos"];
        twosAvailable = twosData[0]; 
    } else {
        playerScoreCell = twosCellPlayerTwo;  
        twosData = playerTwoUpperHouseScores["twos"];
        twosAvailable = twosData[0]; 
    }

    if (twosAvailable) {
        if (diceValues.includes(2)) {
            var twosScore = 0;
            for (i of diceValues) {
                if (i === 2) {
                    twosScore += i;  
                }
            }

            enableAnimation(playerScoreCell, twosScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["twos"] = [false, twosScore];
                    playerOneTotal += twosScore
                } else {
                    playerTwoUpperHouseScores["twos"] = [false, twosScore];
                    playerTwoTotal += twosScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, twosScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateThrees() {
    var threesData;
    var threesAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = threesCellPlayerOne; 
        threesData = playerOneUpperHouseScores["threes"];
        threesAvailable = threesData[0]; 
    } else {
        playerScoreCell = threesCellPlayerTwo;  
        threesData = playerTwoUpperHouseScores["threes"];
        threesAvailable = threesData[0]; 
    }

    if (threesAvailable) {
        if (diceValues.includes(3)) {
            var threesScore = 0;
            for (i of diceValues) {
                if (i === 3) {
                    threesScore += i;  
                }
            }

            enableAnimation(playerScoreCell, threesScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["threes"] = [false, threesScore];
                    playerOneTotal += threesScore
                } else {
                    playerTwoUpperHouseScores["threes"] = [false, threesScore];
                    playerTwoTotal += threesScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, threesScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateFours() {
    var foursData;
    var foursAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = foursCellPlayerOne; 
        foursData = playerOneUpperHouseScores["fours"];
        foursAvailable = foursData[0]; 
    } else {
        playerScoreCell = foursCellPlayerTwo;  
        foursData = playerTwoUpperHouseScores["fours"];
        foursAvailable = foursData[0]; 
    }

    if (foursAvailable) {
        if (diceValues.includes(4)) {
            var foursScore = 0;
            for (i of diceValues) {
                if (i === 4) {
                    foursScore += i;  
                }
            }

            enableAnimation(playerScoreCell, foursScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["fours"] = [false, foursScore];
                    playerOneTotal += foursScore
                } else {
                    playerTwoUpperHouseScores["fours"] = [false, foursScore];
                    playerTwoTotal += foursScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, foursScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateFives() {
    var fivesData;
    var fivesAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = fivesCellPlayerOne; 
        fivesData = playerOneUpperHouseScores["fives"];
        fivesAvailable = fivesData[0]; 
    } else {
        playerScoreCell = fivesCellPlayerTwo;  
        fivesData = playerTwoUpperHouseScores["fives"];
        fivesAvailable = fivesData[0]; 
    }

    if (fivesAvailable) {
        if (diceValues.includes(5)) {
            var fivesScore = 0;
            for (i of diceValues) {
                if (i === 5) {
                    fivesScore += i;  
                }
            }

            enableAnimation(playerScoreCell, fivesScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["fives"] = [false, fivesScore];
                    playerOneTotal += fivesScore
                } else {
                    playerTwoUpperHouseScores["fives"] = [false, fivesScore];
                    playerTwoTotal += fivesScore
                }
                
                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, fivesScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}


function validateSixes() {
    var sixesData;
    var sixesAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = sixesCellPlayerOne; 
        sixesData = playerOneUpperHouseScores["sixes"];
        sixesAvailable = sixesData[0]; 
    } else {
        playerScoreCell = sixesCellPlayerTwo;  
        sixesData = playerTwoUpperHouseScores["sixes"];
        sixesAvailable = sixesData[0]; 
    }

    if (sixesAvailable) {
        if (diceValues.includes(6)) {
            var sixesScore = 0;
            for (i of diceValues) {
                if (i === 6) {
                    sixesScore += i;  
                }
            }

            enableAnimation(playerScoreCell, sixesScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneUpperHouseScores["sixes"] = [false, sixesScore];
                    playerOneTotal += sixesScore;
                } else {
                    playerTwoUpperHouseScores["sixes"] = [false, sixesScore];
                    playerTwoTotal += sixesScore;
                }
                
                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, sixesScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateThreeOfAKind() {
    var threeKindData;
    var threeKindAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = threeKCellPlayerOne; 
        threeKindData = playerOneLowerHouseScores["threeKind"];
        threeKindAvailable = threeKindData[0]; 
    } else {
        playerScoreCell = threeKCellPlayerTwo;  
        threeKindData = playerTwoLowerHouseScores["threeKind"];
        threeKindAvailable = threeKindData[0]; 
    }

    if (threeKindAvailable) {
        if (diceFrequency.includes(3)) {
            var threeKindScore = 0;
            for (i of diceValues) {
                threeKindScore += i;
            }

            enableAnimation(playerScoreCell, threeKindScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneLowerHouseScores["threeKind"] = [false, threeKindScore];
                    playerOneTotal += threeKindScore
                } else {
                    playerTwoLowerHouseScores["threeKind"] = [false, threeKindScore];
                    playerTwoTotal += threeKindScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, threeKindScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function validateFourOfAKind() {
    var fourKindData;
    var fourKindAvailable;
    var playerScoreCell;

    if (currentPlayer === 1) {
        playerScoreCell = fourKCellPlayerOne; 
        fourKindData = playerOneLowerHouseScores["fourKind"];
        fourKindAvailable = fourKindData[0]; 
    } else {
        playerScoreCell = fourKCellPlayerTwo;  
        fourKindData = playerTwoLowerHouseScores["fourKind"];
        fourKindAvailable = fourKindData[0]; 
    }

    if (fourKindAvailable) {
        if (diceFrequency.includes(4)) {
            var fourKindScore = 0;
            for (i of diceValues) {
                fourKindScore += i;
            }

            enableAnimation(playerScoreCell, fourKindScore);

            playerScoreCell.addEventListener("click", () => {
                if (currentPlayer === 1) {
                    playerOneLowerHouseScores["fourKind"] = [false, fourKindScore];
                    playerOneTotal += fourKindScore
                } else {
                    playerTwoLowerHouseScores["fourKind"] = [false, fourKindScore];
                    playerTwoTotal += fourKindScore
                }

                allCells.splice(allCells.indexOf(playerScoreCell), 1);
    
                fixScore(playerScoreCell, fourKindScore);
                clearCells();
                endTurn();
            }) 
        } else {
            disableAnimation(playerScoreCell);
        } 
    }
}

function endTurn() {
    switchPlayer();
}

function clearCells() {
    for (cell of allCells) {
        console.log(cell)
        disableAnimation(cell);
    }
}

function enableAnimation(scoreCell, score) {
    scoreCell.innerHTML = score;
    scoreCell.style.backgroundColor = "#50c878";
    scoreCell.style.webkitAnimationName = 'animateCell';
    scoreCell.style.webkitAnimationDuration = '1s';
    scoreCell.style.webkitAnimationIterationCount = 'infinite'; 
}

function disableAnimation(scoreCell) {
    scoreCell.innerHTML = "";
    scoreCell.style.opacity = 1;
    scoreCell.style.backgroundColor = "white"; 
    scoreCell.style.webkitAnimationName = '';
    scoreCell.style.webkitAnimationDuration = ''; 
}

function fixScore(scoreCell, score) {
    scoreCell.innerHTML = score;
    scoreCell.style.opacity = 1;
    scoreCell.style.backgroundColor = "white"; 
    scoreCell.style.webkitAnimationName = '';
    scoreCell.style.webkitAnimationDuration = '';  
}

// Decides whether certain scoring cells can be selected or
// not
function allocateAvailableScores() {
    // Quickly reducing the number of available rolls
    diceRollsLeft -= 1;

    // Upper house scores to validate
    validateOnes();
    validateTwos();
    validateThrees();
    validateFours();
    validateFives();
    validateSixes();

    // Lower house scores to validate
    validateThreeOfAKind();
    validateFourOfAKind();

    // Checking whether it is ok to switch players
    if (diceRollsLeft === 0) {
        switchPlayer();
    }
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