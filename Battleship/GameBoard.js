export class GameBoard {
  constructor(containerId, isPlayer) {
    this.container = document.getElementById(containerId);
    this.isPlayer = isPlayer;
    this.boardSize = 100; 
    this.blocks = [];
    this.createBoard();
  }

  createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.className = `${
      this.isPlayer ? "player" : "computer"
    }-game-board game-board`; 

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.boardSize; i++) {
      const block = document.createElement("div");
      block.className = "block";
      block.id = i;
      fragment.appendChild(block);
      this.blocks.push(block);
    }
    boardContainer.appendChild(fragment);
    this.container.appendChild(boardContainer);
  }

  getBlockById(id) {
    return this.blocks[id];
  }
}
