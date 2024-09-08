import { GameBoard } from "./GameBoard.js";
import { Ship } from "./Ship.js";
import { getValidity, highlightArea } from "./Helpers.js";

export class GameManager {
  static OPTIONS_CONTAINER = document.querySelector(".options-container");

  constructor() {
    this.playerBoard = new GameBoard("player-gameboard-container", true);
    this.computerBoard = new GameBoard("computer-gameboard-container", false);
    this.ships = [
      new Ship("destroyer", 2),
      new Ship("submarine", 3),
      new Ship("cruiser", 3),
      new Ship("battleship", 4),
      new Ship("carrier", 5),
    ];
    this.currentPlayer = "player";
    this.setupEventListeners();
    this.angle = 0;
  }

  setupEventListeners() {
    document.getElementById("flip-btn").addEventListener("click", this.flip.bind(this));
    document
      .getElementById("start-btn")
      .addEventListener("click", this.startGame.bind(this));
    this.setupDragAndDrop();
  }

  flip() {
    this.angle = this.angle === 0 ? 90 : 0;
    const OPTION_SHIPS = Array.from(GameManager.OPTIONS_CONTAINER.children);
    OPTION_SHIPS.forEach((optionShip) => {
      optionShip.classList.toggle("rotate-90-deg", this.angle === 90);
    });
  }

  setupDragAndDrop() {
    let draggedShip;

    const dragStart = (e) => {
      draggedShip = e.target;
    };

    const dragOver = (e) => {
      e.preventDefault();
      if (draggedShip && typeof draggedShip.id !== "undefined") {
        const ship = this.ships[draggedShip.id];
        highlightArea(e.target.id, ship, this.angle);
      }
    };

    const dropShip = (e) => {
      e.preventDefault();
      const startId = e.target.id;
      if (draggedShip && typeof draggedShip.id !== "undefined") {
        const ship = this.ships[draggedShip.id];
        const successfulPlacement = this.addShipToBoard(ship, startId, true);

        if (successfulPlacement) {
          draggedShip.remove();
        }
      }
      cleanHighlight(); // Drop işleminden sonra highlight temizle
    };

    const dragEnd = () => {
      cleanHighlight(); // Drag işlemi tamamlandığında highlight temizle
    };

    const dragLeave = (e) => {
      cleanHighlight(); // Fare tahtadan ayrıldığında highlight temizle
    };

    document.querySelectorAll(".option").forEach((ship) => {
      ship.addEventListener("dragstart", dragStart);
      ship.addEventListener("dragend", dragEnd); // Drag end olayını ekle
    });

    document.querySelectorAll(".player-game-board .block").forEach((block) => {
      block.addEventListener("dragover", dragOver);
      block.addEventListener("drop", dropShip);
      block.addEventListener("dragleave", dragLeave);
    });

    const cleanHighlight = () => {
      document.querySelectorAll(".player-game-board .block").forEach((block) => {
        block.classList.remove("valid-highlight", "invalid-highlight");
      });
    };
  }

  startGame() {
    if (typeof this.playerTurn === "undefined") {
      if (GameManager.OPTIONS_CONTAINER.children.length !== 0) {
        alert("Please place all your pieces first!");
      } else {
        const allBoardBlocks = document.querySelectorAll("#computer .block");
        allBoardBlocks.forEach((block) =>
          block.addEventListener("click", this.handleClick.bind(this))
        );
        this.playerTurn = true;
        document.getElementById("computer-gameboard-container").className = "turn";
      }
    }
  }

  addShipToBoard(ship, startId, isPlayer) {
    const board = isPlayer ? this.playerBoard : this.computerBoard;
    const allBoardBlocks = Array.from(
      document.querySelectorAll(`.${isPlayer ? "player" : "computer"}-game-board .block`)
    );
    const isHorizontal = isPlayer ? this.angle === 0 : Math.random() < 0.5;
    const startIndex = startId
      ? parseInt(startId)
      : Math.floor(Math.random() * board.boardSize);

    const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
      allBoardBlocks,
      isHorizontal,
      startIndex,
      ship
    );

    if (isValidPlacement && isNotTaken) {
      shipBlocks.forEach((block) => {
        block.classList.add(ship.name);
        block.classList.add("taken");
      });
      return true;
    }

    if (!isPlayer) {
      return this.addShipToBoard(ship, null, false);
    }
    return false;
  }

  handleClick(e) {
    if (this.gameover) return;

    const target = e.target;
    const block = target.classList.contains("block") ? target : target.closest(".block");

    if (block.classList.contains("boom")) {
      return;
    }

    if (block.classList.contains("taken")) {
      block.classList.add("boom");
      if (block && block.appendChild) {
        block.appendChild(document.getElementById("boom-img").cloneNode(true));
      }
      document.getElementById("hitting-sound").play();

      let classes = Array.from(block.classList);
      classes = classes.filter(
        (className) => !["block", "boom", "taken"].includes(className)
      );
      this.playerHits.push(...classes);
      checkScore("Player", this.playerHits, this.PLAYER_SUNK_SHIPS);
    } else {
      block.classList.add("empty");
      document.getElementById("missing-sound").play();
    }

    this.playerTurn = false;
    const allBoardBlocks = document.querySelectorAll("#computer .block");
    allBoardBlocks.forEach((block) => {
      const clonedBlock = block.cloneNode(true);
      block.replaceWith(clonedBlock);
    });
    setTimeout(() => this.computerTurn(), 3000);
  }

  computerTurn() {
    if (this.gameover) return;
    document.getElementById("computer-gameboard-container").removeAttribute("class");
    document.getElementById("player-gameboard-container").className = "turn";

    setTimeout(() => {
      let randomGo;
      if (this.lastHit) {
        const adjacent = getAdjacentBlocks(this.lastHit);
        randomGo = adjacent.find(
          (index) =>
            !document.querySelectorAll("#player .block")[index].classList.contains("boom")
        );
      }
      if (!randomGo) {
        randomGo = Math.floor(Math.random() * this.boardSize);
      }

      const allBoardBlocks = document.querySelectorAll("#player .block");
      const element = allBoardBlocks[randomGo];

      if (element.classList.contains("boom")) {
        this.computerTurn();
        return;
      }

      if (element.classList.contains("taken")) {
        element.classList.add("boom");
        element.appendChild(document.getElementById("boom-img").cloneNode(true));
        document.getElementById("hitting-sound").play();
        this.lastHit = randomGo;
        let classes = Array.from(element.classList);
        classes = classes.filter(
          (className) => !["block", "boom", "taken"].includes(className)
        );
        this.computerHits.push(...classes);
        checkScore("Computer", this.computerHits, this.COMPUTER_SUNK_SHIPS);
      } else {
        element.classList.add("empty");
        document.getElementById("missing-sound").play();
      }
    }, 3000);

    setTimeout(() => {
      this.playerTurn = true;
      document.getElementById("player--container").removeAttribute("class");
      document.getElementById("computer-gameboard-container").className = "turn";
      const allBoardBlocks = document.querySelectorAll("#computer .block");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", this.handleClick.bind(this))
      );
    }, 6000);
  }
}
