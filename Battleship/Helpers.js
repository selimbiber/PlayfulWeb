export function highlightArea(startId, ship, angle) {
  const allBoardBlocks = document.querySelectorAll(".player-game-board .block");
  const startIndex = parseInt(startId);
  const isHorizontal = angle === 0;

  allBoardBlocks.forEach((block) =>
    block.classList.remove("valid-highlight", "invalid-highlight")
  );

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

  for (let i = 0; i < ship.length; i++) {
    const index = isHorizontal ? startIndex + i : startIndex + i * boardSize;

    if (index < 0 || index >= allBoardBlocks.length) {
      isValidPlacement = false;
      break;
    }

    if (isHorizontal && (startIndex % boardSize) + ship.length > boardSize) {
      isValidPlacement = false;
      break;
    }

    const block = allBoardBlocks[index];
    if (block.classList.contains("taken")) {
      isNotTaken = false;
    }

    shipBlocks.push(block);
  }

  return { shipBlocks, isValidPlacement, isNotTaken };
}
