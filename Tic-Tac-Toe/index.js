
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

    if (currentPlayer == 'O' && running) {
        setTimeout(() => {
            let move = -1;

            // 1. Check if AI can win
            move = findBestMove("O");

            // 2. If not, check if AI needs to block player "X"
            if (move === -1) {
                move = findBestMove("X");
            }

            // 3. If no win or block, pick a random available spot
            if (move === -1) {
                const availableIndices = options.map((v, i) => v === "" ? i : null).filter(v => v !== null);
                move = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            }

            if (move !== -1) {
                const targetCell = document.querySelector(`div[cellIndex="${move}"]`);
                updateCell(targetCell, move);
                checkWinner();
            }
        }, 500);
    }
}

// Helper function to find a winning or blocking move
function findBestMove(playerSymbol) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        const values = [options[a], options[b], options[c]];
        
        // If two cells are the same player and the third is empty
        if (values.filter(v => v === playerSymbol).length === 2 && values.filter(v => v === "").length === 1) {
            if (options[a] === "") return a;
            if (options[b] === "") return b;
            if (options[c] === "") return c;
        }
    }
    return -1;
}

function checkWinner() {
    let roundWon = false;
    let winningIndices = []; // Store the indices to highlight later
    
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];
        
        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            winningIndices = condition; // Save the [a, b, c] array
            break;
        }
    }
    
    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        // Highlight winning cells
        winningIndices.forEach(index => {
            document.querySelector(`div[cellIndex="${index}"]`).classList.add('winnerCell');
        });
    }
    else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
        // Turn all cells yellow for a draw
        cells.forEach(cell => cell.classList.add('draw'));
    }
    else {
        changePlayer();
    }
}
function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winnerCell'); // Clear win color
        cell.classList.remove('draw'); // Clear draw color
    });
    running = true;
}