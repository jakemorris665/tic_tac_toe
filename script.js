let player1 = ""
let player2 = ""
let executed = false

const player = (name, score) => {

    const getName = () => name;
    const getScore = () => ++score;

    return {getName, getScore}

};

const gameDisplay = (() => {

    const modalIntro = document.getElementById("modalIntro")
    const overlayShowing = document.getElementById("overlay")
    const gameButtonModal = document.getElementById("gameButtonModal")
    const gameBoard = document.getElementById("gameBoard")
    const playerName1 = document.getElementById("playerName1")
    const playerTwo = document.getElementById("playerTwo")
    const modalShowing = document.getElementById("modal")
    const player1NameDisplay = document.getElementById("player1NameDisplay")
    const player2NameDisplay = document.getElementById("player2NameDisplay")
    const player1ScoreDisplay = document.getElementById("player1ScoreDisplay")
    const player2ScoreDisplay = document.getElementById("player2ScoreDisplay")
    let dataValue = 0

    //generates game grid
    function generateBoard () {
        
        
        if (gameBoard.firstChild == undefined) {
            gameBoard.className = "gameBoard"
            for (i = 0; i < 9; i++) {
                let gridSquare = document.createElement("div");
                gameBoard.appendChild(gridSquare);
                gridSquare.className = "gridSquare";
                gridSquare.id = "gridSquare";
                gridSquare.setAttribute("data", dataValue)
                dataValue++
            }   
        }

        player1 = player(`${playerName1.value}`, -1)

        if (document.getElementById("playerName2").checked == true) {
            player2 = player(`${playerTwo.value}`, -1)
        } else {
            player2 = player("computer", -1)
        }

        modalIntro.style.display = "none"
        overlayShowing.style.display = "none"

        player1NameDisplay.textContent = `${player1.getName()}`
        player1ScoreDisplay.textContent = `${player1.getScore()}`
        player2NameDisplay.textContent = `${player2.getName()}`
        player2ScoreDisplay.textContent = `${player2.getScore()}`

        gameFlow()

    }

    function showModalIntro () {
        modalIntro.style.display = "flex"
        overlayShowing.style.display = "block"
        modalShowing.style.display = "none"
        gameButtonModal.addEventListener('click', generateBoard)
    }
  
    showModalIntro()
   
  
})();


const gameFlow = (() => {

    if (!executed) {
    
    executed = true;
    const resetBtns = document.querySelectorAll("#newGame")
    const gameBoard = document.getElementById("gameBoard");
    const popUpText = document.getElementById("winnerAnnounce");
    const overlayShowing = document.getElementById("overlay")
    const modalShowing = document.getElementById("modal")
    const newPlayers = document.getElementById("newPlayers")
    const modalIntro = document.getElementById("modalIntro")
    const player1ScoreDisplay = document.getElementById("player1ScoreDisplay")
    const player2ScoreDisplay = document.getElementById("player2ScoreDisplay")
    const AIselected = document.getElementById("computer2")

    //player1 always x
    let turn = "X";
    let playerTurn = player1.getName()
    //player2 always y
    //turnCount so the game knows when there is a tie
    let turnCount = 1;
    let gameBoardValues = [0,1,2,3,4,5,6,7,8];

    //all of the winning combinations
    const winCon = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    //toggles turns
    function turnChanger() {

        if (turn === "X") {
            turn = "O"
            playerTurn = player2.getName()
        } else {
            turn = "X"
            playerTurn = player1.getName()
        }
    }

    const resetBoard = () => {
        gameBoardValues = [0,1,2,3,4,5,6,7,8];
        console.log(gameBoardValues)
        turn = "X"
        playerTurn = player1.getName()
        turnCount = 1;
        overlayShowing.style.display = "none"
        modalShowing.style.display = "none"

        let squares = gameBoard.children
        for (i=0; i<squares.length; i++){
            let gridChild = squares[i];
            if(gridChild.firstChild !== undefined && gridChild.firstChild !== null){
                gridChild.firstChild.remove()
            }     
        }
    }

    const showNewPlayers = () => {
        resetBoard()
        modalIntro.style.display = "flex"
        overlayShowing.style.display = "block"
        modalShowing.style.display = "none"
    }

    newPlayers.addEventListener('click', showNewPlayers)

    //the button to reset the values and clear the board
    resetBtns.forEach(resetBtn => {
        resetBtn.addEventListener('click', resetBoard)
    })

        
    //adds marking to grid squares
    gameBoard.addEventListener('click', function(e) {

        //displays the popup when the game is over
        function displayWindow () {
            overlayShowing.style.display = "block"
            modalShowing.style.display = "flex"
        }
    
        //creates the game squares and assigns each one an index
        if (e.target.className === "gridSquare" && e.target.firstChild == undefined) {
            let marking = document.createElement("span")
            let markingComp = document.createElement("span")
            e.target.appendChild(marking)
            let tempIndex = parseInt(marking.parentElement.getAttribute("data"))

            function easyAI () {
                let availSpaces = gameBoardValues.filter(value => value !== "X" && value !=="O");
                let randIndex = Math.floor(Math.random() * availSpaces.length);
                let chosenSquare = availSpaces[randIndex]
                let thisSquare = document.querySelector(`[data="${chosenSquare}"]`);
                thisSquare.appendChild(markingComp);
                markingComp.textContent = "O"
                markingComp.className = "markingO";
                gameBoardValues.splice(chosenSquare, 1, "O")
                console.log(gameBoardValues)
            }

            //adds the X or O marking to the square you click and splices the X or O to the board array
            if (turn == "X") {
                console.log(turn)
                marking.textContent = "X";
                marking.className = "markingX";
                gameBoardValues.splice(tempIndex, 1, e.target.textContent)
            } else if (turn == "O" && AIselected.checked == false){
                marking.textContent = "O";
                marking.className = "markingO"
                gameBoardValues.splice(tempIndex, 1, e.target.textContent)
            }

            //checks if a winCon has been met
            if (checkWin()) {
                popUpText.textContent = `${playerTurn} wins!`
                
                if(turn === "X"){
                    player1ScoreDisplay.textContent = `${player1.getScore()}`
                } else {
                    player2ScoreDisplay.textContent = `${player2.getScore()}`
                }

                displayWindow()
            } else if (!checkWin() && (turnCount < 9) && AIselected.checked == true) {
                turnChanger();
                turnCount++
                let timeout = false;
                easyAI()
                
                if(checkWin()) {
                    popUpText.textContent = `${playerTurn} wins!`
                
                    if(turn === "X"){
                        player1ScoreDisplay.textContent = `${player1.getScore()}`
                    } else {
                        player2ScoreDisplay.textContent = `${player2.getScore()}`
                    }

                    displayWindow()
                } else if(!checkWin() && (turnCount < 9)){
                    turnChanger();
                    turnCount++
                } else {
                    displayWindow();
                    popUpText.textContent = `Tie!`
                }

            } else if(!checkWin() && (turnCount < 9)) {
                turnChanger()
                turnCount++
            } else {
                displayWindow()
                popUpText.textContent = `Tie!`
            }
            }
        })

        function checkWin () {

            let xValues = [];
            let oValues = [];

            //collects all of the indexes of X and O from the gameboard array
            for (let i = 0; i < gameBoardValues.length; i++){
                if (gameBoardValues[i] === "X"){
                    xValues.push(i)
                } else if (gameBoardValues[i] === "O") {
                    oValues.push(i)
                }
            }

            //checks if any of the index combinations in winCon are present in the X or O positions
            return winCon.some(function(element){
                return element.every(function(i){
                    if (turn === "X"){
                        return xValues.indexOf(i) !== -1
                    } else {
                        return oValues.indexOf(i) !== -1
                    }
                        
                });
            })
        } 
    }
    
});
