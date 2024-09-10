export class GameBoard {
  constructor(containerId, isPlayer) {
    this.container = document.getElementById(containerId);
    this.isPlayer = isPlayer;
    this.boardSize = 100;
    this.blocks = [];
    this.createBoard();
  }

  createBoard() {
    const boardContainer = this.createBoardContainer();
    const fragment = this.createBoardBlocks();
    boardContainer.appendChild(fragment);
    this.container.appendChild(boardContainer);

    if (this.isPlayer) {
      this.addDataAttributesToBlocks();
    }
  }

  createBoardContainer() {
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

  addDataAttributesToBlocks() {
    document.querySelectorAll(".player-game-board .block").forEach((block, index) => {
      block.dataset.index = index;
    });
  }

  getBlockById(id) {
    return this.blocks[id];
  }

  clearBoard() {
    this.blocks.forEach((block) => {
      block.className = "block"; // Clear all classes
    });
  }
}
