import { GameBoard } from "./GameBoard.js";
import { Ship } from "./Ship.js";
import { highlightArea, getValidity, restoreShipOptions } from "./Helpers.js";

export class GameManager {
  static OPTIONS_CONTAINER = document.querySelector(".options-container");
  static BUTTON_IDS = {
    flip: "flip-btn",
    start: "start-btn",
    restart: "restart-btn",
  };

  constructor() {
    this.ships = [
      new Ship("destroyer", 2),
      new Ship("submarine", 3),
      new Ship("cruiser", 3),
      new Ship("battleship", 4),
      new Ship("carrier", 5),
    ];

    this.playerBoard = new GameBoard("player-gameboard-container", true);
    this.computerBoard = new GameBoard("computer-gameboard-container", false);

    this.resetGame();
    this.setupEventListeners();
    this.angle = 0;
  }

  resetGame() {
    this.currentPlayer = "player";
    this.playerHits = [];
    this.computerHits = [];
    this.playerSunkShips = [];
    this.computerSunkShips = [];
    this.gameover = false;
    this.lastHit = null;
    this.playerTurn = false;

    this.updateButtonVisibility(true);
    this.playerBoard.clearBoard();
    this.computerBoard.clearBoard();
    this.setupDragAndDrop();
    this.placeShips(this.computerBoard, false);
  }

  placeShips(board, isPlayer) {
    if (!isPlayer) {
      this.ships.forEach((ship) => {
        let successfulPlacement = false;
        while (!successfulPlacement) {
          const startId = Math.floor(Math.random() * board.boardSize);
          const isHorizontal = Math.random() < 0.5;
          successfulPlacement = this.addShipToBoard(
            ship,
            startId,
            isPlayer,
            board,
            isHorizontal
          );
        }
      });
    }
  }

  addShipToBoard(ship, startId, isPlayer, board, isHorizontal) {
    const allBoardBlocks = this.getBoardBlocks(isPlayer);
    const startIndex = startId || Math.floor(Math.random() * board.boardSize);

    const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
      allBoardBlocks,
      isHorizontal,
      startIndex,
      ship
    );

    console.log(`Ship: ${ship.name}`);
    console.log(`Start Index: ${startIndex}`);
    console.log(`Is Valid Placement: ${isValidPlacement}`);
    console.log(`Is Not Taken: ${isNotTaken}`);
    console.log(`Ship Blocks:`, shipBlocks);

    if (isValidPlacement && isNotTaken) {
      shipBlocks.forEach((block) => block.classList.add(ship.name, "taken"));
      return true;
    }
    return false;
  }

  setupEventListeners() {
    document
      .getElementById(GameManager.BUTTON_IDS.flip)
      .addEventListener("click", this.flip.bind(this));
    document
      .getElementById(GameManager.BUTTON_IDS.start)
      .addEventListener("click", this.startGame.bind(this));
    document
      .getElementById(GameManager.BUTTON_IDS.restart)
      .addEventListener("click", this.restartGame.bind(this));
  }

  flip() {
    this.angle = this.angle === 0 ? 90 : 0;
    Array.from(GameManager.OPTIONS_CONTAINER.children).forEach((optionShip) =>
      optionShip.classList.toggle("rotate-90-deg", this.angle === 90)
    );
  }

  setupDragAndDrop() {
    let draggedShip;

    const dragStart = (e) => (draggedShip = e.target);

    const dragOver = (e) => {
      e.preventDefault();
      const target = e.target.closest(".block");
      if (draggedShip && target) {
        const ship = this.ships[draggedShip.id];
        highlightArea(target.id, ship, this.angle);
      }
    };

    const dropShip = (e) => {
      e.preventDefault();
      const target = e.target.closest(".block");
      if (draggedShip && target) {
        const ship = this.ships[draggedShip.id];
        console.log(`Dropping ship: ${ship.name} at ${target.id}`);
        const success = this.addShipToBoard(
          ship,
          target.id,
          true,
          this.playerBoard,
          this.angle === 0
        );
        if (success) {
          draggedShip.remove();
          console.log(`Ship ${ship.name} successfully placed.`);
        } else {
          console.log(`Failed to place ship ${ship.name}.`);
        }
        this.cleanHighlight();
      }
    };

    const dragEnd = () => this.cleanHighlight();
    const dragLeave = () => this.cleanHighlight();

    document.querySelectorAll(".option").forEach((ship) => {
      ship.addEventListener("dragstart", dragStart);
      ship.addEventListener("dragend", dragEnd);
    });

    document.querySelectorAll(".player-game-board .block").forEach((block) => {
      block.addEventListener("dragover", dragOver);
      block.addEventListener("drop", dropShip);
      block.addEventListener("dragleave", dragLeave);
    });
  }

  cleanHighlight() {
    document.querySelectorAll(".player-game-board .block").forEach((block) => {
      block.classList.remove("valid-highlight", "invalid-highlight");
    });
  }

  handleClick(event) {
    const blockId = event.target.id;
    console.log(`Clicked block ID: ${blockId}`);
  }

  startGame() {
    if (GameManager.OPTIONS_CONTAINER.children.length !== 0) {
      alert("Please place all your pieces first!");
      return;
    }

    document.querySelectorAll(".computer-game-board .block").forEach((block) => {
      block.addEventListener("click", this.handleClick.bind(this));
    });

    this.playerTurn = true;
    this.updateTurnIndicators();
    this.updateButtonVisibility(false);
  }

  restartGame() {
    this.updateButtonVisibility(true);
    this.resetGame();
    restoreShipOptions(GameManager.OPTIONS_CONTAINER);
    this.setupDragAndDrop();
  }

  updateTurnIndicators() {
    document
      .getElementById("computer-gameboard-container")
      .classList.toggle("turn", this.playerTurn);
    document
      .getElementById("player-gameboard-container")
      .classList.toggle("turn", !this.playerTurn);
  }

  updateButtonVisibility(show) {
    document.getElementById(GameManager.BUTTON_IDS.flip).style.display = show
      ? "block"
      : "none";
    document.getElementById(GameManager.BUTTON_IDS.start).style.display = show
      ? "block"
      : "none";
    document.getElementById(GameManager.BUTTON_IDS.restart).style.display = show
      ? "none"
      : "block";
  }

  getBoardBlocks(isPlayer) {
    return Array.from(
      document.querySelectorAll(`.${isPlayer ? "player" : "computer"}-game-board .block`)
    );
  }
}
