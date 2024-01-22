function gameboard() {
   const board = [];

   let rows = 3;
   let columns = 3;

   for(let i = 0; i < rows; i++) {
      board[i] = [];
      for(let j = 0; j < columns; j++) {
          board[i].push(Cell());
      }
   }
      
   const getBoard = () => board;
    
   const play = (column, row, player) => {
        board[row][column].addChoice(player);
   };

   const printBoard = () => {
       const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
       console.log(boardValues);
   };

   const Value = (row, column) => {
       return board[row][column].getValue();
      
   };

   return {getBoard, play, printBoard, Value};


}

function Cell() {
    let value = 0;

    const addChoice = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addChoice, getValue};

}

function gameControl(player1 = "Player 1", player2 = "Player 2") {
    const board = gameboard();
    const players = [{name: player1, choice: 'x'}, {name: player2, choice:'o'}];

    let horizontalWin = false;
    let verticalWin = false;
    let diagonalWin = false;
    let diagonalWin1 = false;
    let full = false;

    let activePlayer = players[0];
    let played = players[1];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

    const whoPlayed = () => {
        played = played === players[1] ? players[0] : players[1];
    }

    const getActivePlayer = () => activePlayer;

    const getWhoPlayed = () => played;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    const playRound = (column, row) => {
        if( board.Value(row, column) !== 0 ) {
            return;
        }
        console.log(` ${getActivePlayer().name} put ${getActivePlayer().choice} on column ${column} and on row ${row} `)
        board.play(column, row, getActivePlayer().choice);
    
        if((board.Value(row, 0) !== 0) && (board.Value(row, 0) === board.Value(row, 1)) && (board.Value(row, 1) === board.Value(row, 2))) {
             horizontalWin = true;
            // console.log(board.Value(row, 0), board.Value(row, 1), board.Value(row, 2));
        }

        if( (board.Value(0,column) !== 0) && (board.Value(0, column) === board.Value(1, column) && board.Value(1, column) === board.Value(2, column))) {
             verticalWin = true;
        }

        if((board.Value(0, 0)===board.Value(1, 1) && board.Value(1, 1) === board.Value(2, 2) && board.Value(0, 0) != 0)) {
            diagonalWin = true;
        }

        if((board.Value(0, 2)===board.Value(1, 1) && board.Value(1, 1) === board.Value(2, 0) && board.Value(1, 1) !== 0)) {
            diagonalWin1 = true;
        }

        let cnt = 0;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(board.Value(i, j) !== 0) {
                    cnt++;
                }
            }
        }

        if(cnt === 9) {
            full = true;
        }

       /* if (full && !re && !res) {
            console.log("Game over, its a draw")
        }


        if(res || re) {
            console.log(`${getActivePlayer().name} won the game`);
            //board.printBoard();
        }*/
               
        switchPlayerTurn();
        whoPlayed();
        //printNewRound();
    };

    const getDiagonalWin = () => diagonalWin;
    const getDiagonalWin1 = () => diagonalWin1;
    const getHorizontalWin = () => horizontalWin;
    const geVerticalWin = () => verticalWin;
    const getFull = () => full;


    return{playRound, getActivePlayer, getBoard: board.getBoard, getDiagonalWin, getHorizontalWin, geVerticalWin, getFull, getWhoPlayed, getDiagonalWin1};
}


function screenController() {
    let winningRow = 5, winningCol = 5;

    const game = gameControl();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const result = document.querySelector('.result');
    const btn = document.querySelector('.btnn');

    const reset = document.createElement('button');
    reset.classList.add("btn");
    reset.textContent = "Reset";

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const whoPlayed = game.getWhoPlayed();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        if(game.getFull()) {
            result.textContent = "Its a Tie";
            btn.appendChild(reset);
            boardDiv.removeEventListener("click", clickHandlerBoard);
            playerTurnDiv.textContent = ``;
        }
        if(game.getDiagonalWin() || game.geVerticalWin() || game.getHorizontalWin() || game.getDiagonalWin1()) {
            result.textContent = `${whoPlayed.name} won the game`;
            btn.appendChild(reset);
            boardDiv.removeEventListener("click", clickHandlerBoard);
            playerTurnDiv.textContent = ``;
        }

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexCol) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                if((indexRow == winningRow) || (indexCol == winningCol) || (indexRow==indexCol && game.getDiagonalWin()) || ((Math.abs(indexCol-indexRow)==2 || (indexCol == 1 && indexRow == 1))  && game.getDiagonalWin1())) {
                    cellButton.classList.add("winningCell");
                    console.log("it worked");
                }

                cellButton.dataset.column = indexCol;
                cellButton.dataset.row = indexRow;
                cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if(!selectedCol || !selectedRow) return;

        game.playRound(selectedCol, selectedRow);

        if(game.getHorizontalWin()) {
            winningRow = selectedRow;
        }
        if(game.geVerticalWin()) {
            winningCol = selectedCol;
        }

        //console.log(winningRow, winningCol);

        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    reset.addEventListener("click", () => {
        window.location.reload();
    });

    updateScreen();
}

screenController();
