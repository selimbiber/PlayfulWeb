import { GameBoard } from "./GameBoard.js";
import { Ship } from "./Ship.js";
import {
  highlightArea,
  getValidity,
  restoreShipOptions,
  getAdjacentBlocks,
} from "./Helpers.js";

export class GameManager {
  static hittingSound = new Audio("Assets/Sounds/hitting.mp3");
  static missingSound = new Audio("Assets/Sounds/missing.mp3");
  static sunkSound = new Audio("Assets/Sounds/sunk.mp3");
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

    this.setupEventListeners();
    this.angle = 0;
    this.playerHits = [];
    this.computerHits = [];
    this.playerSunkShips = new Set();
    this.computerSunkShips = new Set();
    this.gameover = false;
    this.lastHit = null;
    this.playerTurn = false;
  }

  resetGame() {
    this.playerHits = [];
    this.computerHits = [];
    this.playerSunkShips.clear(); // Clear the set of sunk ships
    this.computerSunkShips.clear(); // Clear the set of sunk ships
    this.gameover = false;
    this.lastHit = null;
    this.playerTurn = false;
    this.angle = 0;

    document.getElementById("computer-gameboard-container").removeAttribute("class");
    document.getElementById("player-gameboard-container").removeAttribute("class");

    this.updateButtonVisibility(true);
    this.playerBoard.clearBoard();
    this.computerBoard.clearBoard();
    this.playerBoard.createBoard();
    this.computerBoard.createBoard();
    this.setupDragAndDrop();
    this.placeShips(this.computerBoard, false);
  }

  placeShips(board, isPlayer) {
    if (!isPlayer) {
      this.ships.forEach((ship) => {
        let attempts = 0;
        let successfulPlacement = false;
        while (!successfulPlacement && attempts < 100) {
          const startId = Math.floor(Math.random() * board.boardSize);
          const isHorizontal = Math.random() < 0.5;
          successfulPlacement = this.addShipToBoard(
            ship,
            startId,
            isPlayer,
            isHorizontal
          );
          attempts++;
        }
      });
    }
  }

  addShipToBoard(ship, startId, isPlayer, isHorizontal) {
    const allBoardBlocks = this.getBoardBlocks(isPlayer);
    const startIndex = parseInt(startId, 10);

    const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
      allBoardBlocks,
      isHorizontal,
      startIndex,
      ship
    );

    if (isValidPlacement && isNotTaken) {
      shipBlocks.forEach((block) => block.classList.add(ship.name, "taken"));
      if (isPlayer) {
        shipBlocks.forEach((block) => {
          block.dataset.shipId = ship.name;
        });
      }
      return true;
    }
    return false;
  }

  flip() {
    this.angle = this.angle === 0 ? 90 : 0;
    Array.from(GameManager.OPTIONS_CONTAINER.children).forEach((optionShip) =>
      optionShip.classList.toggle("rotate-90-deg", this.angle === 90)
    );
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

  setupDragAndDrop() {
    let draggedShip;

    const dragStart = (e) => {
      draggedShip = e.target;
      e.dataTransfer.setData("text/plain", draggedShip.id);
    };

    const dragOver = (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      if (draggedShip && target.classList.contains("block")) {
        const ship = this.ships[parseInt(draggedShip.id)];
        highlightArea(target.id, ship, this.angle);
      }
    };

    const dropShip = (e) => {
      e.preventDefault();
      const startId = e.currentTarget.id;
      const draggedShipId = e.dataTransfer.getData("text/plain");

      if (draggedShipId && startId) {
        const ship = this.ships[parseInt(draggedShipId)];
        if (draggedShip) {
          const successfulPlacement = this.addShipToBoard(
            ship,
            startId,
            true,
            this.angle === 0
          );

          if (successfulPlacement) {
            draggedShip.remove();
            draggedShip = null;
          }
          this.cleanHighlight();
        }
      }
    };

    const dragEnd = () => {
      this.cleanHighlight();
      draggedShip = null;
    };

    const dragLeave = () => {
      this.cleanHighlight();
    };

    // Clear old event listeners
    document.querySelectorAll(".option").forEach((ship) => {
      ship.removeEventListener("dragstart", dragStart);
      ship.removeEventListener("dragend", dragEnd);
      ship.addEventListener("dragstart", dragStart);
      ship.addEventListener("dragend", dragEnd);
    });

    document.querySelectorAll(".player-game-board .block").forEach((block) => {
      block.removeEventListener("dragover", dragOver);
      block.removeEventListener("drop", dropShip);
      block.removeEventListener("dragleave", dragLeave);
      block.addEventListener("dragover", dragOver);
      block.addEventListener("drop", dropShip);
      block.addEventListener("dragleave", dragLeave);
      block.addEventListener("click", this.handleClick.bind(this));
    });
  }

  cleanHighlight() {
    document.querySelectorAll(".player-game-board .block").forEach((block) => {
      block.classList.remove("valid-highlight", "invalid-highlight");
    });
  }

  handleHit(block, isPlayer) {
    const shipName = block.dataset.shipId;

    if (block.classList.contains("taken")) {
      block.classList.add("boom");
      GameManager.hittingSound.play();

      if (shipName) {
        if (this.isSunk(shipName, isPlayer)) {
          isPlayer
            ? this.playerSunkShips.add(shipName)
            : this.computerSunkShips.add(shipName);
          alert(`${shipName} is sunk!`);
          GameManager.sunkSound.play();
        }
        return;
      }
    }
    block.classList.add("empty");
    GameManager.missingSound.play();
  }

  startGame() {
    if (GameManager.OPTIONS_CONTAINER.children.length !== 0) {
      alert("Please place all your pieces first!");
      return;
    }
    this.placeShips(this.computerBoard, false);
    document.querySelectorAll(".computer-game-board .block").forEach((block) => {
      block.addEventListener("click", this.handleClick.bind(this));
    });

    document.getElementById("computer-gameboard-container").className = "turn";

    this.playerTurn = true;
    this.updateButtonVisibility(false);
  }

  restartGame() {
    this.resetGame();
    restoreShipOptions(GameManager.OPTIONS_CONTAINER);
    this.setupDragAndDrop();
    this.updateButtonVisibility(true);
  }

  updateButtonVisibility(show) {
    const flipButton = document.getElementById(GameManager.BUTTON_IDS.flip);
    const startButton = document.getElementById(GameManager.BUTTON_IDS.start);
    const restartButton = document.getElementById(GameManager.BUTTON_IDS.restart);

    if (!show) {
      flipButton.classList.add("hidden");
      startButton.classList.add("hidden");
      restartButton.classList.remove("hidden");
      return;
    }
    flipButton.classList.remove("hidden");
    startButton.classList.remove("hidden");
    restartButton.classList.add("hidden");
  }

  handleClick(e) {
    if (this.gameover || !this.playerTurn) return;
    const target = e.target;
    const block = target.classList.contains("block") ? target : target.closest(".block");

    if (!block || block.classList.contains("boom")) return;

    if (block.classList.contains("taken")) {
      block.classList.add("boom");
      const boomImg = document.createElement("img");
      boomImg.src = "./assets/images/boom.png";
      boomImg.alt = "";
      block.appendChild(boomImg.cloneNode(true));
      const shipSunk = this.isSunk(block.dataset.shipId, true);

      if (shipSunk) {
        GameManager.sunkSound.play();
        this.playerSunkShips.add(block.dataset.shipId);
        this.checkScore("Player", this.playerHits, this.playerSunkShips);
        return;
      }
      GameManager.hittingSound.play();
      this.playerHits.push(block.dataset.shipId);
      this.checkScore("Player", this.playerHits, this.playerSunkShips);
    } else {
      block.classList.add("empty");
      GameManager.missingSound.play();
      this.handleHit(block, true);
    }

    this.playerTurn = false;
    document.querySelectorAll(".computer-game-board .block").forEach((block) => {
      const clonedBlock = block.cloneNode(true);
      block.replaceWith(clonedBlock);
    });

    setTimeout(() => this.computerTurn(), 3000);
  }

  computerTurn() {
    if (this.gameover || this.playerTurn) return;

    document.getElementById("computer-gameboard-container").classList.remove("turn");
    document.getElementById("player-gameboard-container").classList.add("turn");

    setTimeout(() => {
      let randomGo;

      if (this.lastHit !== null) {
        const adjacent = getAdjacentBlocks(this.lastHit);
        randomGo = adjacent.find(
          (index) =>
            !document
              .querySelectorAll(".player-game-board .block")
              [index].classList.contains("boom")
        );
      }

      if (randomGo === undefined) {
        const allBoardBlocks = document.querySelectorAll(".player-game-board .block");
        randomGo = Math.floor(Math.random() * allBoardBlocks.length);
      }

      const allPlayerBoardBlocks = document.querySelectorAll(".player-game-board .block");
      const element = allPlayerBoardBlocks[randomGo];

      if (!element || element.classList.contains("boom")) return;

      if (element.classList.contains("taken")) {
        element.classList.add("boom");
        const boomImg = document.createElement("img");
        boomImg.src = "./assets/images/boom.png";
        boomImg.alt = "";
        element.appendChild(boomImg.cloneNode(true));
        GameManager.hittingSound.play();
        this.lastHit = randomGo;
        const shipName = element.dataset.shipId;

        if (shipName) {
          this.computerHits.push(shipName);
          if (this.isSunk(shipName, false)) {
            this.computerSunkShips.add(shipName);
            GameManager.sunkSound.play();
          }
          this.checkScore("Computer", this.computerHits, this.computerSunkShips);
        }
        return;
      }
      element.classList.add("empty");
      GameManager.missingSound.play();
      this.lastHit = null;

      this.playerTurn = true;
      document.getElementById("player-gameboard-container").classList.remove("turn");
      document.getElementById("computer-gameboard-container").classList.add("turn");

      document
        .querySelectorAll(".player-game-board .block")
        .forEach((block) => block.addEventListener("click", this.handleClick.bind(this)));

      this.checkGameOver();
    }, 3000);
  }

  isSunk(shipName, isPlayer) {
    const blocks = document.querySelectorAll(
      `.${isPlayer ? "player" : "computer"}-game-board .block`
    );
    const allBlocks = Array.from(blocks).filter(
      (block) => block.dataset.shipId === shipName
    );

    return allBlocks.every((block) => block.classList.contains("boom"));
  }

  checkScore(playerType, hits, sunkShips) {
    const sunkShipsSet = new Set(sunkShips);

    hits.forEach((hit) => {
      if (!sunkShipsSet.has(hit)) {
        sunkShipsSet.add(hit);
      }
    });
  }

  checkGameOver() {
    const allShips = ["destroyer", "submarine", "cruiser", "battleship", "carrier"];

    if (allShips.every((ship) => this.playerSunkShips.has(ship))) {
      console.log("Computer wins!");
      this.gameover = true;
    } else if (allShips.every((ship) => this.computerSunkShips.has(ship))) {
      console.log("Player wins!");
      this.gameover = true;
    }
  }

  getBoardBlocks(isPlayer) {
    return Array.from(
      document.querySelectorAll(`.${isPlayer ? "player" : "computer"}-game-board .block`)
    );
  }
}
