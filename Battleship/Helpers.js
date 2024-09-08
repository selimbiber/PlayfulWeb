export function highlightArea(startId, ship, angle) {
  const allBoardBlocks = document.querySelectorAll(".block");
  const startIndex = parseInt(startId);
  const isHorizontal = angle === 0;

  allBoardBlocks.forEach((block) => block.classList.remove("highlight"));

  const shipBlocks = [];
  for (let i = 0; i < ship.length; i++) {
    const index = isHorizontal ? startIndex + i : startIndex + i * 10;
    if (index >= 0 && index < allBoardBlocks.length) {
      const block = allBoardBlocks[index];
      block.classList.add("highlight");
      shipBlocks.push(block);
    }
  }

  return shipBlocks;
}
