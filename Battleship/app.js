// DOM Elements
const GAMEBOARDS_CONTAINER = document.getElementById("gameboards-container");
const OPTIONS_CONTAINER = document.querySelector(".options-container");
const FLIP_BUTTON = document.getElementById("flip-button");

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

function createBoard(user) {
  const gameboardContainer = document.createElement("div");
  gameboardContainer.className = `game-board ${user}-game-board`;
  gameboardContainer.id = user;

  GAMEBOARDS_CONTAINER.append(gameboardContainer);

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.className = "block";
    block.id = i;
    gameboardContainer.appendChild(block);
  }
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

const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

// Gemiler
const ships = [destroyer, submarine, cruiser, battleship, carrier];

let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  const shipLength = ship.length;
  let validStartIndex;

  if (isHorizontal) {
    validStartIndex = (startIndex % width) + shipLength <= width ? startIndex : -1;
  } else {
    validStartIndex = startIndex + (shipLength - 1) * width < boardSize ? startIndex : -1;
  }

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

  const isValidPlacement = shipBlocks.every((block, index) => {
    return isHorizontal
      ? Number(shipBlocks[0].id) % width <= width - ship.length
      : Number(shipBlocks[0].id) + (ship.length - 1) * width < boardSize;
  });

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
    return true; // Successful placement
  } else {
    // Retry for computer, fail for player
    if (user === "computer") {
      return addShipPiece(user, ship, null); // Retry without specific startId
    } else {
      notDropped = true;
      return false; // Failed to place ship
    }
  }
}

// Add ships to gameboard
ships.forEach((ship) => addShipPiece("computer", ship));

// Drag player ships

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

  if (!successfulPlacement) {
    // Optionally handle unsuccessful placement
    console.log("Failed to place ship:", ship.name);
  } else {
    draggedShip.remove(); // Remove ship from options if placed successfully
  }
}

// Add highlight
function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#player .block");
  const isHorizontal = angle === 0;

  const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (isValidPlacement) {
    shipBlocks.forEach((shipBlock) => {
      if (shipBlock) {
        shipBlock.classList.add("hover");
        setTimeout(() => shipBlock.classList.remove("hover"), 500);
      }
    });
  }
}
