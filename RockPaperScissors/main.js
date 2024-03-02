// Container

const container = document.querySelector(".container");

// Heading

const heading = document.querySelector(".heading");

// Report

const report = document.querySelector(".report");

// Icons

const iconsArea = document.querySelector(".icons-area");
const leftIcon = document.getElementById("left-icon");
const rightIcon = document.getElementById("right-icon");

// Scores

const scoresArea = document.querySelector(".scores-area");
const playerScoreDOM = document.querySelector(".player-score");
const computerScoreDOM = document.querySelector(".computer-score");

// For Functions

let playerScore = 0;
let computerScore = 0;

// Options

const optionsArea = document.querySelector(".options-area");
const rock = document.querySelector(".rock");
const paper = document.querySelector(".paper");
const scissors = document.querySelector(".scissors");

// Events

rock.addEventListener("click", (get) => {
  game(get.target.getAttribute("alt"));
});

paper.addEventListener("click", (get) => {
  game(get.target.getAttribute("alt"));
});

scissors.addEventListener("click", (get) => {
  game(get.target.getAttribute("alt"));
});

// Functions

function game(playerChoice) {
  playRound(playerChoice);

  playerScoreDOM.textContent = playerScore;
  computerScoreDOM.textContent = computerScore;

  if (playerScore === 5 || computerScore === 5) {
    if (playerScore > computerScore) {
      heading.textContent = "Yeah! You beat the computer.";
      heading.classList = "";
      heading.setAttribute("class", "win");
    } else if (computerScore > playerScore) {
      heading.textContent = "Oh no! Computer beat you.";
      heading.classList = "";
      heading.setAttribute("class", "lose");
    } else {
      heading.textContent = "What luck! You are tied with the computer.";
      heading.classList = "";
      heading.setAttribute("class", "draw");
    }
    playAgainQuestion();
  }
}

function isPlayerWinner(playerChoice, computerChoice) {
  const choices = {
    Rock: "Scissors",
    Paper: "Rock",
    Scissors: "Paper",
  };
  return choices[playerChoice] === computerChoice;
}

function isComputerWinner(playerChoice, computerChoice) {
  const choices = {
    Rock: "Scissors",
    Paper: "Rock",
    Scissors: "Paper",
  };
  return choices[computerChoice] === playerChoice;
}

function playRound(playerChoice) {
  const computerSelectionsArray = ["Rock", "Paper", "Scissors"];
  const computerChoice =
    computerSelectionsArray[
      Math.floor(Math.random() * computerSelectionsArray.length)
    ];

  if (isPlayerWinner(playerChoice, computerChoice)) {
    report.textContent = "You won this round!";
    report.setAttribute("class", "win");
    return ++playerScore;
  } else if (isComputerWinner(playerChoice, computerChoice)) {
    report.textContent = "The computer won this round!";
    report.setAttribute("class", "lose");
    return ++computerScore;
  } else {
    report.textContent = "Player and Computer tied.";
    report.setAttribute("class", "draw");
  }
}

function playAgainQuestion() {
  report.classList = "";
  report.setAttribute("class", "report");
  report.textContent = "Do you want to play again?";

  leftIcon.classList.remove("playerIcon");
  leftIcon.setAttribute("class", "answer-yes");
  leftIcon.setAttribute("src", "./assets/yes-icon.webp");
  leftIcon.setAttribute("alt", "Yes");

  leftIcon.addEventListener("click", () => {
    restartGame();
  });

  rightIcon.classList.remove("computerIcon");
  rightIcon.setAttribute("class", "answer-no");
  rightIcon.setAttribute("src", "./assets/no-icon.svg");
  rightIcon.setAttribute("alt", "No");

  rightIcon.addEventListener("click", () => {
    finishGame();
  });

  iconsArea.style.gap = "5rem";
  scoresArea.remove();
  optionsArea.remove();
}

function restartGame() {
  location.reload();
}

function finishGame() {
  container.removeChild(container.firstElementChild);
  container.children[0].textContent = "GOODBYE!";
  container.children[0].style.fontSize = "10rem";
  container.children[0].style.color = "red";
  setInterval(() => {
    window.close();
  }, 3000);
}
