import { generate } from 'https://esm.sh/random-words';

// Constants
const GRID_ROWS = 6;
const WORD_LENGTH = 5;

// State
let currentWord = "";
let currentRowIndex = 0;

// Elements
const guessGrid = document.getElementById('guessGrid');
const letterCells = document.querySelectorAll('.letterCell');
const checkBtn = document.getElementById('checkGuess');
const newWordBtn = document.getElementById('generate-btn');

/**
 * 1. Initialize the Game Grid
 */
function initGrid() {
    guessGrid.innerHTML = ""; // Clear existing
    for (let r = 0; r < GRID_ROWS; r++) {
        const row = document.createElement('div');
        row.className = 'guessRow';
        row.id = `row-${r}`;
        row.style.display = 'flex';
        row.style.gap = '10px';
        row.style.marginBottom = '10px';

        for (let c = 0; c < WORD_LENGTH; c++) {
            const input = document.createElement('input');
            input.className = 'guessCell';
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            // Disable all rows except the first one initially
            input.disabled = (r !== 0); 
            
            // Auto-focus logic
            input.addEventListener('input', (e) => {
                if (e.target.value && c < WORD_LENGTH - 1) {
                    row.children[c + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === "Enter") {
                    checkGuess();
                }
            });
            // Backspace logic
            input.addEventListener('keydown', (e) => {
                if (e.key === "Backspace" && !e.target.value && c > 0) {
                    row.children[c - 1].focus();
                }
            });

            row.appendChild(input);
        }
        guessGrid.appendChild(row);
    }
}

/**
 * 2. Generate New Word
 */
function showNewWord() {
    currentRowIndex = 0;
    initGrid();
    
    currentWord = generate({ exactly: 1, minLength: 5, maxLength: 5, join: "" }).toLowerCase();
    
    // Fill the top hint cells (hidden/visible as per your style)
    const letters = currentWord.split("");
    letterCells.forEach((cell, i) => {
        cell.textContent = letters[i];
        cell.style.visibility = 'hidden'; // Hide the answer by default!
        cell.id = `Lettercell-${i}`;
    });

    console.log("Target Word:", currentWord);
}

/**
 * 3. Check Guess Logic
 */
function checkGuess() {
    const row = document.getElementById(`row-${currentRowIndex}`);
    const inputs = Array.from(row.children);
    const guess = inputs.map(input => input.value.toLowerCase()).join("");

    // 1. Shake Logic for incomplete words
    if (guess.length !== WORD_LENGTH) {
        row.classList.add('shake-animation');
        setTimeout(() => {
            row.classList.remove('shake-animation');
        }, 400);
        return;
    }

    const targetArr = currentWord.split("");
    const guessArr = guess.split("");
    const statuses = Array(WORD_LENGTH).fill("gray"); 

    // 2. First pass: Find Greens (Correct spot)
    guessArr.forEach((letter, i) => {
        if (letter === targetArr[i]) {
            statuses[i] = "green";
            targetArr[i] = null; 
            const lettercell = document.getElementById(`Lettercell-${i}`);
            if (lettercell) {
                lettercell.style.visibility = 'visible';
            }
        }
    });

    // 3. Second pass: Find Yellows (Wrong spot)
    guessArr.forEach((letter, i) => {
        if (statuses[i] !== "green" && targetArr.includes(letter)) {
            statuses[i] = "yellow";
            targetArr[targetArr.indexOf(letter)] = null;
        }
    });

    // 4. Apply colors using classes (SNAPPY Performance)
    inputs.forEach((input, i) => {
        input.disabled = true; // Lock the row
        input.blur();          // Remove focus to prevent keyboard lag
        
        // Remove existing colors if any, then add new status
        input.classList.remove('correct', 'present', 'absent'); 
        
        if (statuses[i] === "green") {
            input.classList.add('correct');
        } else if (statuses[i] === "yellow") {
            input.classList.add('present');
        } else {
            input.classList.add('absent');
        }
        
        // Ensure text is white for better contrast
        input.style.color = "white"; 
    });

    // 5. Game State Logic
    if (guess === currentWord) {
        // Reveal all hint cells on win
        letterCells.forEach(cell => cell.style.visibility = 'visible');
        setTimeout(() => alert("You won! 🎉"), 100);
    } else if (currentRowIndex < GRID_ROWS - 1) {
        currentRowIndex++;
        const nextRow = document.getElementById(`row-${currentRowIndex}`);
        Array.from(nextRow.children).forEach(input => input.disabled = false);
        nextRow.children[0].focus();
    } else {
        alert(`Game Over! Word was: ${currentWord.toUpperCase()}`);
    }
}


// Event Listeners
newWordBtn.addEventListener('click', showNewWord);
checkBtn.addEventListener('click', checkGuess);

// Start game
showNewWord();
