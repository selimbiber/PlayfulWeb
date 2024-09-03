// DOM Elements
const PLAYER_GAMEBOARD_CONTAINER = document.getElementById("player-gameboard-container");
const COMPUTER_GAMEBOARD_CONTAINER = document.getElementById(
  "computer-gameboard-container"
);
const OPTIONS_CONTAINER = document.querySelector(".options-container");
const FLIP_BUTTON = document.getElementById("flip-btn");
const START_BUTTON = document.getElementById("start-btn");

const BOOM_IMG = document.createElement("img");
BOOM_IMG.src = "./assets/images/boom.png";

// Sound Effects
const MISSING_SOUND = new Audio("./assets/sounds/missing.mp3");
const HITTING_SOUND = new Audio("./assets/sounds/hitting.mp3");
HITTING_SOUND.volume = 0.3;
const SUNK_SOUND = new Audio("./assets/sounds/sunk.mp3");

let angle = 0;

function flip() {
  const OPTION_SHIPS = Array.from(OPTIONS_CONTAINER.children);
  angle = angle === 0 ? 90 : 0;
  OPTION_SHIPS.forEach((optionShip) => {
    optionShip.classList.toggle("rotate-90-deg", angle === 90);
  });
}

const width = 10;
const boardSize = width * width;

function createBoard(admiral) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.className = `game-board ${admiral}-game-board`;
  gameboardContainer.id = admiral;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < boardSize; i++) {
    const block = document.createElement("div");
    block.className = "block";
    block.id = i;
    fragment.appendChild(block);
  }

  gameboardContainer.appendChild(fragment);
  admiral === "player"
    ? PLAYER_GAMEBOARD_CONTAINER.appendChild(gameboardContainer)
    : COMPUTER_GAMEBOARD_CONTAINER.appendChild(gameboardContainer);
}

createBoard("player");
createBoard("computer");

FLIP_BUTTON.addEventListener("click", flip);

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const ships = [
  new Ship("destroyer", 2),
  new Ship("submarine", 3),
  new Ship("cruiser", 3),
  new Ship("battleship", 4),
  new Ship("carrier", 5),
];

function calculateValidStartIndex(isHorizontal, startIndex, shipLength) {
  if (isHorizontal) {
    const endColumn = (startIndex % width) + shipLength - 1;
    return endColumn < width ? startIndex : -1;
  }
  const endRow = Math.floor(startIndex / width) + shipLength - 1;
  return endRow < width ? startIndex : -1;
}

function checkValidityOfPlacement(shipBlocks, isHorizontal, shipLength) {
  const startIndex = Number(shipBlocks[0].id);

  return shipBlocks.every((block, index) => {
    if (isHorizontal) return startIndex % width <= width - shipLength;
    return startIndex + (shipLength - 1) * width < boardSize;
  });
}

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  const shipLength = ship.length;
  const validStartIndex = calculateValidStartIndex(isHorizontal, startIndex, shipLength);

  if (validStartIndex === -1)
    return { shipBlocks: [], isValidPlacement: false, isNotTaken: false };

  const shipBlocks = [];
  for (let i = 0; i < shipLength; i++) {
    const index = isHorizontal ? validStartIndex + i : validStartIndex + i * width;
    if (index >= 0 && index < allBoardBlocks.length) {
      shipBlocks.push(allBoardBlocks[index]);
    } else {
      return { shipBlocks: [], isValidPlacement: false, isNotTaken: false };
    }
  }

  const isValidPlacement = checkValidityOfPlacement(shipBlocks, isHorizontal, shipLength);
  const isNotTaken = shipBlocks.every((block) => !block.classList.contains("taken"));

  return { shipBlocks, isValidPlacement, isNotTaken };
}

function addShipPiece(user, ship, startId) {
  const allBoardBlocks = Array.from(document.querySelectorAll(`#${user} .block`));
  const isHorizontal = user === "player" ? angle === 0 : Math.random() < 0.5;
  const startIndex = startId ? parseInt(startId) : Math.floor(Math.random() * boardSize);

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

  if (user === "computer") {
    return addShipPiece(user, ship, null);
  }
  notDropped = true;
  return false;
}

ships.forEach((ship) => addShipPiece("computer", ship));

let draggedShip;
const optionShips = Array.from(OPTIONS_CONTAINER.children);
optionShips.forEach((optionShip) => optionShip.addEventListener("dragstart", dragStart));

const allPlayerBlocks = document.querySelectorAll("#player .block");
allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener("dragover", dragOver);
  playerBlock.addEventListener("drop", dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  const successfulPlacement = addShipPiece("player", ship, startId);

  if (successfulPlacement) draggedShip.remove();
}

function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#player .block");
  const isHorizontal = angle === 0;

  const { shipBlocks, isValidPlacement } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  shipBlocks.forEach((shipBlock) => {
    shipBlock.classList.add(isValidPlacement ? "hover-valid" : "hover-invalid");
    setTimeout(() => shipBlock.classList.remove("hover-valid", "hover-invalid"), 500);
  });
}

let gameover = false;
let playerTurn;

function startGame() {
  if (playerTurn === undefined) {
    if (OPTIONS_CONTAINER.children.length !== 0) {
      alert("Please place all your pieces first!");
    } else {
      const allBoardBlocks = document.querySelectorAll("#computer .block");
      allBoardBlocks.forEach((block) => block.addEventListener("click", handleClick));
      playerTurn = true;
      COMPUTER_GAMEBOARD_CONTAINER.className = "turn";
    }
  }
}

START_BUTTON.addEventListener("click", startGame);

let playerHits = [];
const PLAYER_SUNK_SHIPS = [];
let computerHits = [];
const COMPUTER_SUNK_SHIPS = [];

function handleClick(e) {
  if (gameover) return;

  const target = e.target;

  // Blok elemanını bul
  const block = target.classList.contains("block") ? target : target.closest(".block");

  // Eğer zaten vurulmuşsa işleme devam etme
  if (block.classList.contains("boom")) {
    return;
  }

  if (block.classList.contains("taken")) {
    block.classList.add("boom");
    if (block && block.appendChild) {
      block.appendChild(BOOM_IMG.cloneNode(true)); // İmg'yi klonla
    }
    HITTING_SOUND.play();

    let classes = Array.from(block.classList);
    classes = classes.filter(
      (className) => !["block", "boom", "taken"].includes(className)
    );
    playerHits.push(...classes);
    checkScore("Player", playerHits, PLAYER_SUNK_SHIPS);
  } else {
    block.classList.add("empty");
    MISSING_SOUND.play();
  }

  playerTurn = false;
  const allBoardBlocks = document.querySelectorAll("#computer .block");
  allBoardBlocks.forEach((block) => {
    const clonedBlock = block.cloneNode(true);
    block.replaceWith(clonedBlock);
  });
  setTimeout(computerGo, 3000);
}

let lastHit = null;
let recentHits = [];

function computerGo() {
  if (gameover) return;
  COMPUTER_GAMEBOARD_CONTAINER.removeAttribute("class");
  PLAYER_GAMEBOARD_CONTAINER.className = "turn";

  setTimeout(() => {
    let randomGo;
    if (lastHit) {
      const adjacent = getAdjacentBlocks(lastHit);
      randomGo = adjacent.find(
        (index) =>
          !document.querySelectorAll(`#player .block`)[index].classList.contains("boom")
      );
    }
    if (!randomGo) {
      randomGo = Math.floor(Math.random() * boardSize);
    }

    const allBoardBlocks = document.querySelectorAll("#player .block");
    const element = allBoardBlocks[randomGo];

    // Blok elemanını bul
    if (element.classList.contains("boom")) {
      computerGo(); // Eğer zaten vurulmuşsa yeni bir yer seç
      return;
    }

    if (element.classList.contains("taken")) {
      element.classList.add("boom");
      element.appendChild(BOOM_IMG.cloneNode(true)); // İmg'yi klonla
      HITTING_SOUND.play();
      lastHit = randomGo;
      let classes = Array.from(element.classList);
      classes = classes.filter(
        (className) => !["block", "boom", "taken"].includes(className)
      );
      computerHits.push(...classes);
      checkScore("Computer", computerHits, COMPUTER_SUNK_SHIPS);
    } else {
      element.classList.add("empty");
      MISSING_SOUND.play();
    }
  }, 3000);

  setTimeout(() => {
    playerTurn = true;
    PLAYER_GAMEBOARD_CONTAINER.removeAttribute("class");
    COMPUTER_GAMEBOARD_CONTAINER.className = "turn";
    const allBoardBlocks = document.querySelectorAll("#computer .block");
    allBoardBlocks.forEach((block) => block.addEventListener("click", handleClick));
  }, 6000);
}

function getAdjacentBlocks(index) {
  const adjacentIndices = [
    index - 1,
    index + 1, // Left and Right
    index - width,
    index + width, // Up and Down
  ];
  return adjacentIndices.filter(
    (i) => i >= 0 && i < boardSize && Math.abs(i - index) <= width
  );
}

function checkScore(admiral, admiralHits, admiralSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      admiralHits.filter((storedShipName) => storedShipName === shipName).length ===
      shipLength
    ) {
      alert(
        `${
          admiral === "Player" ? "You sunk the computer's" : "The computer sunk your"
        } ${shipName}`
      );
      SUNK_SOUND.play();

      if (admiral === "Player") {
        playerHits = admiralHits.filter((storedShipName) => storedShipName !== shipName);
      }
      if (admiral === "Computer") {
        computerHits = admiralHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      admiralSunkShips.push(shipName);
    }
  }

  const shipsObj = {
    destroyer: 2,
    submarine: 3,
    cruiser: 3,
    battleship: 4,
    carrier: 5,
  };

  Object.entries(shipsObj).forEach(([shipName, hitPoints]) =>
    checkShip(shipName, hitPoints)
  );

  function checkIsAllShipsSunk(admiral, admiralSunkShips) {
    if (admiralSunkShips.length === Object.keys(shipsObj).length) {
      alert(
        `${
          admiral === "Player"
            ? "You sunk all the computer's"
            : "The computer has sunk all your"
        } ships. You ${admiral === "Player" ? "WON" : "LOST"}!`
      );
      gameover = true;
    }
  }

  checkIsAllShipsSunk("Player", PLAYER_SUNK_SHIPS);
  checkIsAllShipsSunk("Computer", COMPUTER_SUNK_SHIPS);
}
