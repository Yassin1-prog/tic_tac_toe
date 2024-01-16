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

function gameControl(player1 = "Yassin", player2 = "Hamza") {
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
        console.log(` ${getActivePlayer().name} put ${getActivePlayer().choice} on column ${column} and on row ${row} `)
        board.play(column, row, getActivePlayer().choice)
    
        let res = false;
        let re = false;
        if((board.Value(row, 0) !== 0) && (board.Value(row, 0) === board.Value(row, 1)) && (board.Value(row, 1) === board.Value(row, 2))) {
             res = true;
             console.log(board.Value(row, 0), board.Value(row, 1), board.Value(row, 2));
        }

        if( (board.Value(0,column) !== 0) && (board.Value(0, column) === board.Value(1, column) && board.Value(1, column) === board.Value(2, column)) || (board.Value(0, 0)===board.Value(1, 1) && board.Value(1, 1) === board.Value(2, 2) && board.Value(0, 0) != 0)) {
             re = true;
        }

        console.log(res, re);


        if(res || re) {
            console.log(`${getActivePlayer().name} won the game`);
            board.printBoard();
            throw new Error("GAME OVER");
        }
               
        switchPlayerTurn();
        printNewRound();
    };

    return{playRound, getActivePlayer};
}


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

