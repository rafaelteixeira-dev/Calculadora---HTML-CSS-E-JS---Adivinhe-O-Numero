let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;
let calculationHistory = []; // Array para guardar o histórico
 
const displayElement = document.getElementById('current-calc');
const historyElement = document.getElementById('previous-calc');
const backspaceBtn = document.getElementById('backspace-btn');
const historyBtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const tableGeneratorBtn = document.getElementById('table-generator-btn');
const scientificModeBtn = document.getElementById('scientific-mode-btn');
const gameBtn = document.getElementById('game-btn');
const tablePanel = document.getElementById('table-panel');
const tableNumberInput = document.getElementById('table-number-input');
const generateTableBtn = document.getElementById('generate-table-btn');
const tableResultArea = document.getElementById('table-result-area');
const gamePanel = document.getElementById('game-panel');
const gameFeedbackArea = document.getElementById('game-feedback-area');
const gameGuessInput = document.getElementById('game-guess-input');
const submitGuessBtn = document.getElementById('submit-guess-btn');
const newGameBtn = document.getElementById('new-game-btn');

let secretNumber = 0;

function updateDisplay() {
    displayElement.textContent = currentInput.replace('.', ',');
}

function appendNumber(number) {
    if (displayElement.classList.contains('result-green')) {
        clearDisplay();
    }
    
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    displayElement.classList.remove('result-green');
    updateDisplay();
}

function appendOperator(op) {
    if (op === '(') {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = '(';
            shouldResetScreen = false;
        } else {
            currentInput += '(';
        }
    }
    if (op === '%') {
        currentInput = (parseFloat(currentInput) / 100).toString();
        displayElement.classList.add('result-green');
        updateDisplay();
        return;
    }

    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(op)) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }

    shouldResetScreen = false;
    displayElement.classList.remove('result-green');
    updateDisplay();
}

function calculateResult() {
    if (shouldResetScreen) return;

    let expression = currentInput;
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    historyElement.textContent = expression.replace(/\./g, ',');

    try {
        const sanitizedExpression = expression.replace(/[^-()\d/*+%.Mathsqrtlog10tanccosinsinPIE]/g, '');
        if (sanitizedExpression !== expression) {
            throw new Error("Caracteres inválidos");
        }

        let result = eval(sanitizedExpression);

        const resultText = result.toString().replace('.', ',');
        calculationHistory.push({ expression: historyElement.textContent, result: resultText });
        updateHistoryPanel();

        currentInput = result.toString();
        operator = null;
        
        updateDisplay();
        displayElement.classList.add('result-green');

    } catch (error) {
        currentInput = 'Erro';
        updateDisplay();
        displayElement.classList.add('result-green');
    }
    shouldResetScreen = true;
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    historyElement.textContent = '';
    displayElement.classList.remove('result-green');
    updateDisplay();
}

function toggleSign() {
    if (!isNaN(currentInput)) {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
}

// Botão de Backspace
backspaceBtn.addEventListener('click', () => {
    if (shouldResetScreen) {
        clearDisplay();
        return;
    }
    
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
});

historyBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('show');
});

clearHistoryBtn.addEventListener('click', () => {
    calculationHistory = [];
    updateHistoryPanel();
});

function generateTable() {
    const numberInput = tableNumberInput.value;

    if (numberInput.trim() === "") {
        tableResultArea.innerHTML = '<p style="color: var(--icon-grey);">Digite um número.</p>';
        return;
    }

    const number = parseFloat(numberInput.replace(',', '.'));

    if (isNaN(number)) {
        tableResultArea.innerHTML = '<p style="color: #ff6b6b;">Entrada inválida.</p>';
        return;
    }

    let tableHTML = '';
    for (let i = 1; i <= 10; i++) {
        tableHTML += `<div>${number} × ${i} = <strong>${Number((number * i).toFixed(4))}</strong></div>`;
    }
    tableResultArea.innerHTML = tableHTML;
}

tableGeneratorBtn.addEventListener('click', () => {
    tablePanel.classList.toggle('show');
    if (tablePanel.classList.contains('show')) {
        tableNumberInput.value = '';
        tableResultArea.innerHTML = '';
        tableNumberInput.focus();
    }
});

generateTableBtn.addEventListener('click', generateTable);
tableNumberInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') generateTable();
});

function startNewGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    gameFeedbackArea.textContent = "Digite seu palpite!";
    gameFeedbackArea.style.color = 'var(--text-white)';
    gameGuessInput.value = '';
    gameGuessInput.disabled = false;
    submitGuessBtn.disabled = false;
    gameGuessInput.focus();
}

function checkGuess() {
    const userGuess = parseInt(gameGuessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        gameFeedbackArea.textContent = "Digite um número de 1 a 100.";
        gameFeedbackArea.style.color = '#ff6b6b';
        return;
    }

    if (userGuess > secretNumber) {
        gameFeedbackArea.textContent = "Quente demais! Tente um número menor.";
        gameFeedbackArea.style.color = '#ff8c42'; // Cor quente
    } else if (userGuess < secretNumber) {
        gameFeedbackArea.textContent = "Está frio! Tente um número maior.";
        gameFeedbackArea.style.color = '#63a4ff'; // Cor fria
    } else {
        gameFeedbackArea.textContent = `🎉 Acertou! O número era ${secretNumber}! 🎉`;
        gameFeedbackArea.style.color = 'var(--green-accent)';
        gameGuessInput.disabled = true;
        submitGuessBtn.disabled = true;

        const winSound = new Audio('GTA San Andreas - Mission passed sound.mp3'); 
        const playPromise = winSound.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Erro ao tocar o som:", error);
                alert("Não foi possível tocar o som. Verifique o caminho do arquivo 'grand/success.mp3' e as permissões do navegador.");
            });
        }

    }
    gameGuessInput.value = '';
    gameGuessInput.focus();
}

gameBtn.addEventListener('click', () => {
    gamePanel.classList.toggle('show');
    if (gamePanel.classList.contains('show')) {
        startNewGame();
    }
});

newGameBtn.addEventListener('click', startNewGame);
submitGuessBtn.addEventListener('click', checkGuess);
gameGuessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') checkGuess();
});

function updateHistoryPanel() {
    historyList.innerHTML = '';
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<li style="text-align: center; color: var(--icon-grey);">Nenhum histórico</li>';
        return;
    }

    calculationHistory.slice().reverse().forEach(calc => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${calc.expression} = <strong>${calc.result}</strong>`;
        listItem.addEventListener('click', () => {
            currentInput = calc.result.replace(',', '.');
            updateDisplay();
            historyPanel.classList.remove('show');
        });
        historyList.appendChild(listItem);
    });
}

scientificModeBtn.addEventListener('click', () => {
    document.querySelector('.calculator-container').classList.toggle('scientific-mode-active');
});

document.addEventListener('keydown', (event) => {
    if (historyPanel.classList.contains('show') || tablePanel.classList.contains('show') || gamePanel.classList.contains('show')) {
        if (event.key === 'Escape') document.activeElement.blur();
        return;
    }
    if (['/', '*', '+', '-'].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.' || event.key === ',') {
        appendNumber('.');
    } else if (['+', '-', '*', '/', '%', '('].includes(event.key)) {
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculateResult();
    } else if (event.key === 'Backspace') {
        backspaceBtn.click();
    } else if (event.key.toLowerCase() === 'c' || event.key === 'Escape') {
        clearDisplay();
    }
});