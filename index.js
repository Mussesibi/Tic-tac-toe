const game = (function () {
  //Selecting all divs for play
  const divs = document.querySelectorAll(".container div");
  const displayDiv = document.querySelector(".messages");
  const player1Score = document.querySelector(".scores.player1");
  const player2Score = document.querySelector(".scores.player2");
  const resetScoresBtn = document.querySelector(".reset-life")
  //Adding event listner so when the player clicks it'll display the symbol where he clicked
  divs.forEach((div) => {
    div.addEventListener("click", (e) => {
      if (player1.flag) {
        // displayDiv.classList.remove("winner")
       const dontPlay= player1.play(player1.symbol, div.dataset.value) === -1;
       if(dontPlay) return
        renderSymbolToDom(e.target,player1.symbol)
        displayDiv.classList.remove("error")
    } else {
        // displayDiv.classList.remove("winner")
        const dontPlay = player2.play(player2.symbol, div.dataset.value) === -1;
        if(dontPlay) return
        renderSymbolToDom(e.target,player2.symbol)
        displayDiv.classList.remove("error")

      }
    });
  });

  //Adding event listener for resetScores btn to reset the scores of players
  resetScoresBtn.addEventListener('click', ()=>{
      player1.totalWins = 0
      player2.totalWins = 0
    resetGame()
  })
  //Gameboard Initilaization
  let board = {
    one: " ",
    two: " ",
    three: " ",
    four: " ",
    five: " ",
    six: " ",
    seven: " ",
    eight: " ",
    nine: " ",
  };

  //Creating two players and display their scores on DOM which is zero at beggining 
  const player1 = new CreatePlayer("Thorkil", "X", 0);
  const player2 = new CreatePlayer("Ongli", "O", 0);
  player1Score.textContent = player1.name + " : " +player1.totalWins
  player2Score.textContent = player2.name + " : "+ player2.totalWins
  //Setting flags to determine which player to play next (true = your turn to play, false = not your turn)
  player1.flag = true;
  player2.flag = false;
  let stopGame = false
  //Constructor to make players 
  function CreatePlayer(name, symbol, totalWins) {
    this.name = name;
    this.totalWins = totalWins;
    this.symbol = symbol;
    //Play function to determine whose player turn and put the value in the board using putValueXO
    this.play = function (value, positionOfVal) {
      if (player1.flag) {
        const dontPlay = player1.putValueXO(value, positionOfVal) === -1;
        if(dontPlay) return -1
        player1.flag = false;
        player2.flag = true;
        return 1;
      } else if (player2.flag) {
        const dontPlay = player2.putValueXO(value, positionOfVal) === -1;
        if (dontPlay) return -1;
        player2.flag = false;
        player1.flag = true;
        return 1;
      } else {
        console.error(
          player1.flag
            ? "It's " + player1.name + " turn!."
            : "It's " + player2.name + " turn!."
        );
      }
    };
    //putValueXO function to do validation of the inputs and will keep track of the whole game and determine winner and handle errors and wrong moves
    this.putValueXO = function (value, positionOfVal) {
      if (!(value.toUpperCase() == "X" || value.toUpperCase() == "O")) {
        console.error("Please enter value either X or O");
      } else {
        if (isNaN(positionOfVal)) {
          if (board[positionOfVal] === " ") {
            board[positionOfVal] = value;
            console.log("=================");
            printBoard();
            console.log(this.name + " played in postion " + positionOfVal);
            displayDiv.innerText = this.name + " played in postion " + positionOfVal

            checkWin();
          } else {
            console.error("The position you choose has already been played on");
            displayDiv.classList.add("error")
            displayDiv.innerText = "The position you choose has already been played on"
            return -1;
          }
        } else {
          console.error(
            "Please select a valid postion value. Life is not your mom's game"
          );
        }
      }
    };
  }
  //Will print the board on the console 
  function printBoard() {
    console.log(
      "|" + board.one + "|",
      "|" + board.two + "|",
      "|" + board.three + "|"
    );
    console.log(
      "|" + board.four + "|",
      "|" + board.five + "|",
      "|" + board.six + "|"
    );
    console.log(
      "|" + board.seven + "|",
      "|" + board.eight + "|",
      "|" + board.nine + "|"
    );
  }
  //Checks the winner based on the combinations, and will display the winner and increase his totalWins by 1
  function checkWin() {
    const winCombination = [
      ["one", "two", "three"], // Horizontal
      ["four", "five", "six"],
      ["seven", "eight", "nine"],
      ["one", "four", "seven"], // Vertical
      ["two", "five", "eight"],
      ["three", "six", "nine"],
      ["one", "five", "nine"], // Diagonal
      ["three", "five", "seven"],
    ];

    for (let combination of winCombination) {
      const [a, b, c] = combination;
      if (board[a] !== " " && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] === "X") {
          console.log("#############################################");
          console.log(
            player1.name + " won.                                  #"
          );
          console.log("#############################################");
          player1.totalWins += 1
          stopGame = true
          displayDiv.classList.add("winner")
          displayDiv.innerText = player1.name + " WON !!!"
          resetGame()
          return 1
        } else {
            console.log("#############################################");
            console.log(
                player2.name + " won.                                  #"
                );
                console.log("#############################################");
                player2.totalWins += 1
                stopGame = true
                displayDiv.classList.add("winner")
                displayDiv.innerText = player2.name + " WON !!!"
                resetGame()
                return 1
        }
      } else {
      }
    }
  }
  //Will reset all values and make you start from zero however it'll keep the totalWins variable without changin it
  function resetGame(){
     board = {
        one: " ",
        two: " ",
        three: " ",
        four: " ",
        five: " ",
        six: " ",
        seven: " ",
        eight: " ",
        nine: " ",

    }
    divs.forEach(div=>{
        div.textContent = ""
    })
    player1.flag = true
    player2.flag = false
    player1Score.textContent = player1.name + " : " +player1.totalWins
    player2Score.textContent = player2.name + " : "+ player2.totalWins
  }

  //Will display the symbol in the DOM for the user
  function renderSymbolToDom(div,symbol) {
    if (stopGame) {
        const btn = document.createElement("button")
        btn.innerText = "Restart"
        displayDiv.appendChild(btn)
        btn.addEventListener('click', ()=>{
            displayDiv.classList.remove('winner')
            displayDiv.innerText = ""
            stopGame = false
            resetGame()
        })
        return
    }else {
        
        div.style.fontSize = "60px"
        div.innerText = symbol
    }
  }

  printBoard();
  // player1.play(player1.symbol,"one")
  // player1.play(player1.symbol,"two")
  // player2.play(player2.symbol,"three")
  // player1.play(player1.symbol,"five")
  // player1.play(player1.symbol,"three")
  // player1.play(player1.symbol,"nine")
  return { player1, player2 };
})();
