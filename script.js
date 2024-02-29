class GameBoard {
  constructor() {
    this.board = [];

    this.rows = 3;
    this.columns = 3;

    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.board[i].push(new Cell());
      }
    }
  }

  getBoard() {
    return this.board;
  }

  play(column, row, player) {
    this.board[row][column].addChoice(player);
  }

  value(row, column) {
    return this.board[row][column].getValue();
  }
}

class Cell {
  constructor() {
    this.value = 0;
  }

  addChoice(player) {
    this.value = player;
  }

  getValue() {
    return this.value;
  }
}

class GameControl {
  constructor(player1 = "Player 1", player2 = "Player 2") {
    this.board = new GameBoard();
    this.players = [
      { name: player1, choice: "x" },
      { name: player2, choice: "o" },
    ];

    this.horizontalWin = false;
    this.verticalWin = false;
    this.diagonalWin = false;
    this.diagonalWin1 = false;
    this.full = false;

    this.activePlayer = this.players[0];
    this.played = this.players[1];
  }

  switchPlayerTurn() {
    this.activePlayer =
      this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  whoPlayed() {
    this.played =
      this.played === this.players[1] ? this.players[0] : this.players[1];
  }

  getActivePlayer() {
    return this.activePlayer;
  }

  getWhoPlayed() {
    return this.played;
  }

  playRound(column, row) {
    if (this.board.value(row, column) !== 0) {
      return;
    }

    console.log(
      ` ${this.getActivePlayer().name} put ${
        this.getActivePlayer().choice
      } on column ${column} and on row ${row} `
    );

    this.board.play(column, row, this.getActivePlayer().choice);

    if (
      this.board.value(row, 0) !== 0 &&
      this.board.value(row, 0) === this.board.value(row, 1) &&
      this.board.value(row, 1) === this.board.value(row, 2)
    ) {
      this.horizontalWin = true;
    }

    if (
      this.board.value(0, column) !== 0 &&
      this.board.value(0, column) === this.board.value(1, column) &&
      this.board.value(1, column) === this.board.value(2, column)
    ) {
      this.verticalWin = true;
    }

    if (
      this.board.value(0, 0) === this.board.value(1, 1) &&
      this.board.value(1, 1) === this.board.value(2, 2) &&
      this.board.value(0, 0) !== 0
    ) {
      this.diagonalWin = true;
    }

    if (
      this.board.value(0, 2) === this.board.value(1, 1) &&
      this.board.value(1, 1) === this.board.value(2, 0) &&
      this.board.value(1, 1) !== 0
    ) {
      this.diagonalWin1 = true;
    }

    let cnt = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board.value(i, j) !== 0) {
          cnt++;
        }
      }
    }

    if (cnt === 9) {
      this.full = true;
    }

    this.switchPlayerTurn();
    this.whoPlayed();
  }

  getDiagonalWin() {
    return this.diagonalWin;
  }

  getDiagonalWin1() {
    return this.diagonalWin1;
  }

  getHorizontalWin() {
    return this.horizontalWin;
  }

  getVerticalWin() {
    return this.verticalWin;
  }

  getFull() {
    return this.full;
  }

  getBoard() {
    return this.board.getBoard();
  }
}

class ScreenController {
  constructor() {
    this.winningRow = 5;
    this.winningCol = 5;

    this.game = new GameControl();
    this.playerTurnDiv = document.querySelector(".turn");
    this.boardDiv = document.querySelector(".board");
    this.result = document.querySelector(".result");
    this.btn = document.querySelector(".btnn");

    this.reset = document.createElement("button");
    this.reset.classList.add("btn");
    this.reset.textContent = "Reset";

    this.boardDiv.addEventListener("click", this.clickHandlerBoard.bind(this));

    this.reset.addEventListener("click", () => {
      window.location.reload();
    });

    this.updateScreen();
  }

  updateScreen() {
    this.boardDiv.textContent = "";

    const board = this.game.getBoard();
    const activePlayer = this.game.getActivePlayer();
    const whoPlayed = this.game.getWhoPlayed();

    this.playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    if (this.game.getFull()) {
      this.result.classList.toggle("show");
      this.result.textContent = "It's a Tie";
      this.btn.appendChild(this.reset);
      this.boardDiv.removeEventListener("click", this.clickHandlerBoard);
      this.playerTurnDiv.textContent = ``;
    }
    if (
      this.game.getDiagonalWin() ||
      this.game.getVerticalWin() ||
      this.game.getHorizontalWin() ||
      this.game.getDiagonalWin1()
    ) {
      this.result.classList.toggle("show");
      this.result.textContent = `${whoPlayed.name} won the game`;
      this.btn.appendChild(this.reset);
      this.boardDiv.removeEventListener("click", this.clickHandlerBoard);
      this.playerTurnDiv.textContent = ``;
    }

    board.forEach((row, indexRow) => {
      row.forEach((cell, indexCol) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        if (
          indexRow == this.winningRow ||
          indexCol == this.winningCol ||
          (indexRow == indexCol && this.game.getDiagonalWin()) ||
          ((Math.abs(indexCol - indexRow) == 2 ||
            (indexCol == 1 && indexRow == 1)) &&
            this.game.getDiagonalWin1())
        ) {
          cellButton.classList.add("winningCell");
          console.log("it worked");
        }

        cellButton.dataset.column = indexCol;
        cellButton.dataset.row = indexRow;
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        this.boardDiv.appendChild(cellButton);
      });
    });
  }

  clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;

    if (!selectedCol || !selectedRow) return;

    this.game.playRound(selectedCol, selectedRow);

    if (this.game.getHorizontalWin()) {
      this.winningRow = selectedRow;
    }
    if (this.game.getVerticalWin()) {
      this.winningCol = selectedCol;
    }

    this.updateScreen();
  }
}

const screenController = new ScreenController();
