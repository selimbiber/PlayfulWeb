import { GameManager } from "./GameManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameManager = new GameManager();

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
