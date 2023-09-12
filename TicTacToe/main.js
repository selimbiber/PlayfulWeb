const MARK_SQUARES = document.querySelectorAll('.square');
const STATUS_TEXT = document.querySelector('.status-message_text');
const GAMER_IMG = document.querySelector('.gamer-img');
const COMPUTER_IMG = document.querySelector('.computer-img');
const RESTART_BTN = document.querySelector('.restart-btn');

const WIN_CONDITIONS = [
    ['0', '1', '2'],
    ['3', '4', '5'],
    ['6', '7', '8'],
    ['0', '3', '6'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['0', '4', '8'],
    ['2', '4', '6']
];

let markingOptions = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameRun = false;

function setupGame() {
    MARK_SQUARES.forEach( square => square.addEventListener('click', markSquare) );
    RESTART_BTN.addEventListener('click', restartGame);
    STATUS_TEXT.textContent = `Player ${currentPlayer}'s turn!`
    isGameRun = true;
    RESTART_BTN.style.display = 'none'
}

function markSquare() {
    const SQUARE_INDEX = this.getAttribute('squareIndex');

    if (markingOptions[SQUARE_INDEX] != '' || !isGameRun) {
        return;
    }

    updateSquare(this, SQUARE_INDEX);
    changePlayer();
    checkWinner();
}

function updateSquare(square, index) {
    markingOptions[index] = currentPlayer;
    square.textContent = currentPlayer;
    currentPlayer == 'X' ? square.classList.add('x-mark') : square.classList.add('o-mark');
}

function changePlayer() {
    currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    STATUS_TEXT.textContent = `Player ${currentPlayer}'s turn!`
    if (currentPlayer == 'X') {
        GAMER_IMG.style.display = 'block';
        COMPUTER_IMG.style.display = 'none';
    } else {
        GAMER_IMG.style.display = 'none';
        COMPUTER_IMG.style.display = 'block';
    }
}

function checkWinner() {
    let isThereWinner = false;

    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
        const CURRENT_CONDITION = WIN_CONDITIONS[i];

        const SQUARE_A = markingOptions[CURRENT_CONDITION[0]];
        const SQUARE_B = markingOptions[CURRENT_CONDITION[1]];
        const SQUARE_C = markingOptions[CURRENT_CONDITION[2]];

        if (SQUARE_A == '' || SQUARE_B == '' || SQUARE_C == '') {
            continue;
        }
        if (SQUARE_A == SQUARE_B && SQUARE_B == SQUARE_C) {
            isThereWinner = true;
            break;
        }
    }
    if (isThereWinner) {
        let gameWinner;
        currentPlayer == 'X' ? gameWinner = 'O' : gameWinner = 'X';
        STATUS_TEXT.textContent = `Player ${gameWinner} has won!`
        if (gameWinner == 'X') {
            GAMER_IMG.style.display = 'block';
            COMPUTER_IMG.style.display = 'none';
            STATUS_TEXT.classList.add('x-win');
        } else {
            GAMER_IMG.style.display = 'none';
            COMPUTER_IMG.style.display = 'block';
            STATUS_TEXT.classList.add('o-win');
        }
        isGameRun = false;
        RESTART_BTN.style.display = 'block';
    }
    else if ( markingOptions.includes('') ) {
        STATUS_TEXT.textContent = `Player ${currentPlayer}'s turn!`
    }
    else if ( !markingOptions.includes('') ) {
        STATUS_TEXT.textContent = `Game Draw!`;
        STATUS_TEXT.classList.add('game-draw');
        GAMER_IMG.style.display = 'block';
        COMPUTER_IMG.style.display = 'block';
        RESTART_BTN.style.display = 'block';
    }
    else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = 'X';
    markingOptions = ['', '', '', '', '', '', '', '', ''];
    STATUS_TEXT.className = 'status-message_text';
    STATUS_TEXT.textContent = `Player ${currentPlayer}'s turn!`
    GAMER_IMG.style.display = 'block';
    COMPUTER_IMG.style.display = 'none';
    MARK_SQUARES.forEach(markSquare => {
        markSquare.textContent = '';
        markSquare.classList.remove('x-mark', 'o-mark');
    });
    isGameRun = true;
    RESTART_BTN.style.display = 'none'
}

setupGame();