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

   return {getBoard, play, printBoard};


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
        board.play(column, row, getActivePlayer().name)
    
        const res = new Set(board[row]).size === 1;

        if( (board[0][column] === board[1][column] && board[1][column] === board[2][column]) || (board[0][0]===board[1][1] && board[1][1] === board[2][2])) {
            re = true;
        }


        if(res || re) {
            console.log(`${getActivePlayer().name} won the game`)
            location.reload();
        }
    
         
        switchPlayerTurn();
        printNewRound();
    };

    return{playRound, getActivePlayer};
}

const game = gameControl();

game.playRound(1, 1);
