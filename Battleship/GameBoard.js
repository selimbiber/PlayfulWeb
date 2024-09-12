export class GameBoard {
  constructor(containerId, isPlayer) {
    this.container = document.getElementById(containerId);
    this.isPlayer = isPlayer;
    this.boardSize = 100;
    this.blocks = [];
  }

  clearGameBoard() {
    const boardContainer = this.container.querySelector(
      `.${this.isPlayer ? "player" : "computer"}-game-board`
    );
    if (boardContainer) {
      boardContainer.innerHTML = "";
      this.blocks = [];
    }
  }

  createGameBoard() {
    const gameBoard = this.createGameBoardContainer();
    const fragment = this.createGameBoardBlocks();
    gameBoard.appendChild(fragment);
    this.container.appendChild(gameBoard);
  }

  createGameBoardContainer() {
    const existingContainer = this.container.querySelector(
      `.${this.isPlayer ? "player" : "computer"}-game-board`
    );
    if (existingContainer) {
      return existingContainer;
    }

    const gameBoard = document.createElement("div");
    gameBoard.className = `${
      this.isPlayer ? "player" : "computer"
    }-game-board game-board`;
    return gameBoard;
  }

  createGameBoardBlocks() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.boardSize; i++) {
      const block = this.createBlock(i);
      fragment.appendChild(block);
      this.blocks.push(block);
    }
    return fragment;
  }

  createBlock(id) {
    const block = document.createElement("div");
    block.className = "block";
    block.id = id;
    return block;
  }
}
