export class GameBoard {
  constructor(containerId, isPlayer) {
    this.container = document.getElementById(containerId);
    this.isPlayer = isPlayer;
    this.boardSize = 100;
    this.blocks = [];
  }

  createBoard() {
    this.clearBoard();
    const boardContainer = this.createBoardContainer();
    const fragment = this.createBoardBlocks();
    boardContainer.appendChild(fragment);
    this.container.appendChild(boardContainer);
  }

  clearBoard() {
    const boardContainer = this.container.querySelector(
      `.${this.isPlayer ? "player" : "computer"}-game-board`
    );
    if (boardContainer) {
      boardContainer.innerHTML = "";
      this.blocks = [];
    }
  }

  createBoardContainer() {
    const existingContainer = this.container.querySelector(
      `.${this.isPlayer ? "player" : "computer"}-game-board`
    );
    if (existingContainer) {
      return existingContainer;
    }

    const boardContainer = document.createElement("div");
    boardContainer.className = `${
      this.isPlayer ? "player" : "computer"
    }-game-board game-board`;
    return boardContainer;
  }

  createBoardBlocks() {
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
