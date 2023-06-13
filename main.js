// For The Odin Project: Play Rock Paper Scissors Against to Computer

let playerScore = 0;
let computerScore = 0;

function playRound(playerSelection, computerSelection) {
    playerSelection = playerSelection[0].toUpperCase() + playerSelection.substring(1).toLowerCase();

    const computerChoiceArray = ['Rock', 'Paper', 'Scissors']
    computerSelection = computerChoiceArray[Math.floor(Math.random() * 3)];

        if (playerSelection.length === 0) {
            alert('You cannot enter a empty value. Please try again with Rock, Paper or Scissors.')
        } else if (playerSelection === 'Rock' && computerSelection === 'Scissors') {
            playerScore++;
            alert('You won this round! Rock beats Scissors.')
        } else if (playerSelection === 'Paper' && computerSelection === 'Rock') {
            playerScore++;
            alert('You won this round! Paper beats Rock.')
        } else if (playerSelection === 'Scissors' && computerSelection === 'Paper') {
            playerScore++;
            alert('You won this round! Scissors beats Paper.')
        } else if (computerSelection === 'Rock' && playerSelection === 'Scissors') {
            computerScore++;
            alert('The computer won this round! Rock beats Scissors.')
        } else if (computerSelection === 'Paper' && playerSelection === 'Rock') {
            computerScore++;
            alert('The computer won this round! Paper beats Rock.')
        } else if (computerSelection === 'Scissors' && playerSelection === 'Paper') {
            computerScore++;
            alert('The computer won this round! Scissors beats Paper.')
        } else if (playerSelection === computerSelection) {
            alert('Player and Computer tied.')
        } else {
            alert('You entered the wrong value. You can only choose Rock, Paper or Scissors.')
        }
}

function game() {
    for (let i = 1; i <= 5; i++) {
        playRound( prompt('Choose: Rock, Paper or Scissors.') );
    }
    if (playerScore > computerScore) {
        alert("Yeah! You beat the computer. There is your total score: " + playerScore + ', ' + "and computer's total score: " + computerScore);

    } else if (computerScore > playerScore) {
        alert("Oh no! Computer beat you. There is your total score: " + playerScore + ', ' + "and computer's total score: " + computerScore);
    } else {
        alert("What luck! You are tied with the computer. There is your total score: " + playerScore + ', ' + "and computer's total score: " + computerScore);
    }
    playAgainQuestion(  prompt("Do you wanna play game again for 5 round?") );
    
    function playAgainQuestion (answer) {
        answer = answer[0].toUpperCase() + answer.substring(1).toLowerCase();
        
        if (answer === 'Yes') {
            game();
        } else if (answer === 'No') {
            return alert("Bye!");
        } else {
            alert("I can't understand you. :/ Please check your answer: Yes or No?")
            playAgainQuestion( prompt("Do you wanna play game again for 5 round?") );
        }
    }
}
game();
