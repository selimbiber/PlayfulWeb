export function highlightArea(startId, ship, angle) {
  const allBoardBlocks = document.querySelectorAll(".player-game-board .block");
  const startIndex = parseInt(startId);
  const isHorizontal = angle === 0;

  clearHighlight(allBoardBlocks);

  const { shipBlocks, isValidPlacement, isNotTaken } = getValidity(
    allBoardBlocks,
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

export function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  const shipBlocks = [];
  let isValidPlacement = true;
  let isNotTaken = true;
  const boardSize = 10;

  console.log(
    `Checking validity for ship starting at ${startIndex} ${
      isHorizontal ? "horizontally" : "vertically"
    }`
  );

  for (let i = 0; i < ship.length; i++) {
    const index = isHorizontal ? startIndex + i : startIndex + i * boardSize;
    console.log(`Checking block index: ${index}`);

    // Tahta sınırlarını kontrol et
    if (
      index < 0 ||
      index >= allBoardBlocks.length ||
      (isHorizontal && (startIndex % boardSize) + ship.length > boardSize)
    ) {
      isValidPlacement = false;
      console.log(`Invalid placement: Out of bounds`);
      break;
    }

    const block = allBoardBlocks[index];
    if (block.classList.contains("taken")) {
      isNotTaken = false;
      console.log(`Invalid placement: Block ${index} already taken`);
    }

    shipBlocks.push(block);
  }

  console.log(
    `Result - isValidPlacement: ${isValidPlacement}, isNotTaken: ${isNotTaken}`
  );
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
    { id: 0, class: "destroyer", previewClass: "destroyer-preview" },
    { id: 1, class: "submarine", previewClass: "submarine-preview" },
    { id: 2, class: "cruiser", previewClass: "cruiser-preview" },
    { id: 3, class: "battleship", previewClass: "battleship-preview" },
    { id: 4, class: "carrier", previewClass: "carrier-preview" },
  ];

  ships.forEach((ship) => {
    const div = document.createElement("div");
    div.id = ship.id;
    div.className = `${ship.previewClass} ${ship.class} option`;
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
