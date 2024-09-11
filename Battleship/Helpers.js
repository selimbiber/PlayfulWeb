export function highlightArea(startId, ship, angle) {
  const allPlayerBoardBlocks = document.querySelectorAll(".player-game-board .block");
  const startIndex = parseInt(startId, 10);
  const isHorizontal = angle === 0;

  clearHighlight(allPlayerBoardBlocks);

  const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
    allPlayerBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  shipBlocks.forEach((block) => {
    block.classList.add(
      `${isValidPlacement && isNotTaken ? "valid" : "invalid"}-highlight`
    );
  });

  return shipBlocks;
}

export function getValidity(allPlayerBoardBlocks, isHorizontal, startIndex, ship) {
  const shipBlocks = [];
  let isValidPlacement = true;
  let isNotTaken = true;
  const boardSize = 10;

  for (let i = 0; i < ship.length; i++) {
    const index = isHorizontal ? startIndex + i : startIndex + i * boardSize;

    if (index < 0 || index >= allPlayerBoardBlocks.length) {
      isValidPlacement = false;
      break;
    }

    if (isHorizontal && (startIndex % boardSize) + ship.length > boardSize) {
      isValidPlacement = false;
      break;
    }

    const block = allPlayerBoardBlocks[index];
    if (block.classList.contains("taken")) {
      isNotTaken = false;
    }

    shipBlocks.push(block);
  }

  return { shipBlocks, isValidPlacement, isNotTaken };
}

export function clearHighlight(blocks) {
  blocks.forEach((block) => {
    block.classList.remove("valid-highlight", "invalid-highlight");
  });
}

export function restoreShipOptions(container) {
  container.innerHTML = "";

  const ships = [
    { id: 0, classes: "destroyer destroyer-preview" },
    { id: 1, classes: "submarine submarine-preview" },
    { id: 2, classes: "cruiser cruiser-preview" },
    { id: 3, classes: "battleship battleship-preview" },
    { id: 4, classes: "carrier carrier-preview" },
  ];

  ships.forEach((ship) => {
    const div = document.createElement("div");
    div.id = ship.id;
    div.className = `${ship.classes} option`;
    div.draggable = true;
    container.appendChild(div);
  });
}

export function getAdjacentBlocks(index, boardSize) {
  const adjacentIndices = [];
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  if (row > 0) adjacentIndices.push(index - boardSize); // Up
  if (row < boardSize - 1) adjacentIndices.push(index + boardSize); // Down
  if (col > 0) adjacentIndices.push(index - 1); // Left
  if (col < boardSize - 1) adjacentIndices.push(index + 1); // Right

  return adjacentIndices;
}
