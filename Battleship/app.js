import { GameManager } from "./GameManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameManager = new GameManager();
  gameManager.playerBoard.createGameBoard();
  gameManager.computerBoard.createGameBoard();
  gameManager.setupDragAndDrop();
  initializeGame();
});

function initializeGame() {
  const startButton = document.getElementById("start-btn");
  if (startButton) {
    startButton.disabled = false;
  }

  const flipButton = document.getElementById("flip-btn");
  if (flipButton) {
    flipButton.disabled = false;
  }
}
