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

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
      };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    const playRound = (column, row) => {
        if( board.Value(row, column) !== 0 ) {
            return;
        }
        console.log(` ${getActivePlayer().name} put ${getActivePlayer().choice} on column ${column} and on row ${row} `)
        board.play(column, row, getActivePlayer().choice)
    
        let res = false;
        let re = false;
        let full = true;
        if((board.Value(row, 0) !== 0) && (board.Value(row, 0) === board.Value(row, 1)) && (board.Value(row, 1) === board.Value(row, 2))) {
             res = true;
            // console.log(board.Value(row, 0), board.Value(row, 1), board.Value(row, 2));
        }

        if( (board.Value(0,column) !== 0) && (board.Value(0, column) === board.Value(1, column) && board.Value(1, column) === board.Value(2, column)) || (board.Value(0, 0)===board.Value(1, 1) && board.Value(1, 1) === board.Value(2, 2) && board.Value(0, 0) != 0)) {
             re = true;
        }

        
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(board.Value(i, j) === 0) {
                    full = false;
                }
            }
        }

        if (full && !re && !res) {
            console.log("Game over, its a draw")
        }


        if(res || re) {
            console.log(`${getActivePlayer().name} won the game`);
            //board.printBoard();
        }
               
        switchPlayerTurn();
        //printNewRound();
    };

    return{playRound, getActivePlayer, getBoard: board.getBoard};
}

/*
const game = gameControl();

for(let i = 0; i < 9; i++) {

    // Using prompt to get user input for the first number
    const firstNumberInput = prompt("Enter row:");
    const row = parseFloat(firstNumberInput);

    // Using prompt to get user input for the second number
    const secondNumberInput = prompt("Enter column:");
    const column = parseFloat(secondNumberInput);

    game.playRound(row, column);

}
*/

function screenController() {
    const game = gameControl();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const result = document.querySelector('.result');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, indexRow) => {
            row.forEach((cell, indexCol) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

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
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

screenController();
