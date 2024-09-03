const colorPanel = document.getElementById('colorPanel');
const testPanel = document.getElementById('testPanel');
const calculateScoreButton = document.getElementById('calculateScoreButton');
const resetButton = document.getElementById('resetButton');
const scoreDiv = document.getElementById('score');

const translations = {
    en: {
        originalColorsHeader: "Look at these colors",
        testColorsHeader: "Choose 2 of these colors that are not in the above colors",
        calculateScoreButton: "Calculate Score",
        resetButton: "Reset",
        scoreText: "Your score:",
        selectColorsAlert: "Please select exactly 2 colors.",
        difficultyLabel: "Choose Difficulty:",
        difficultyLevels: ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]
    },
    fa: {
        originalColorsHeader: "به این رنگ‌ها نگاه کنید",
        testColorsHeader: "دو تا از این رنگ‌ها که در رنگ‌های بالا نیستند را انتخاب کنید",
        calculateScoreButton: "محاسبه امتیاز",
        resetButton: "بازی مجدد",
        scoreText: "امتیاز شما:",
        selectColorsAlert: "لطفاً دقیقاً ۲ رنگ انتخاب کنید.",
        difficultyLabel: "انتخاب سطح دشواری:",
        difficultyLevels: ["سطح ۱", "سطح ۲", "سطح ۳", "سطح ۴", "سطح ۵"]
    }
};

function changeLanguage() {
    const language = document.getElementById('language').value;
    document.getElementById('originalColorsHeader').innerText = translations[language].originalColorsHeader;
    document.getElementById('testColorsHeader').innerText = translations[language].testColorsHeader;
    document.getElementById('calculateScoreButton').innerText = translations[language].calculateScoreButton;
    document.getElementById('resetButton').innerText = translations[language].resetButton;
    document.getElementById('difficultyLabel').innerText = translations[language].difficultyLabel;
    scoreDiv.textContent = translations[language].scoreText + " " + score;

    const difficultySelect = document.getElementById('difficulty');
    const options = difficultySelect.options;
    for (let i = 0; i < options.length; i++) {
        options[i].text = translations[language].difficultyLevels[i];
    }
}

let colors = [];
let testColors = [];
let selectedColors = [];
let score = 0;

function generateColors() {
    colors = [];
    const baseRed = Math.floor(Math.random() * 256);
    const baseGreen = Math.floor(Math.random() * 256);
    const baseBlue = Math.floor(Math.random() * 256);
    const channel = Math.floor(Math.random() * 3); // Randomly choose a channel: 0 for red, 1 for green, 2 for blue
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const increment = [20, 15, 10, 5, 1][difficulty - 1];
    const maxStartValue = 255 - (increment * 11);
    const startValue = Math.floor(Math.random() * maxStartValue);

    for (let i = 0; i < 12; i++) {
        let color;
        if (channel === 0) {
            color = `rgb(${startValue + i * increment}, ${baseGreen}, ${baseBlue})`;
        } else if (channel === 1) {
            color = `rgb(${baseRed}, ${startValue + i * increment}, ${baseBlue})`;
        } else {
            color = `rgb(${baseRed}, ${baseGreen}, ${startValue + i * increment})`;
        }
        colors.push(color);
    }
}

function displayColors(panel, colorArray, isTestPanel = false) {
    panel.innerHTML = '';
    colorArray.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-box';
        div.style.backgroundColor = color;
        if (isTestPanel) {
            div.addEventListener('click', () => selectColor(div, color));
        }
        panel.appendChild(div);
    });
}

function generateTestColors() {
    const selectedColors = colors.slice(0, 10);
    const newColors = colors.slice(10, 12);
    const randomSelectedColors = selectedColors.sort(() => Math.random() - 0.5).slice(0, 3);
    testColors = [...randomSelectedColors, ...newColors].sort(() => Math.random() - 0.5);
}

function selectColor(div, color) {
    if (selectedColors.includes(color)) {
        selectedColors = selectedColors.filter(c => c !== color);
        div.classList.remove('selected');
    } else if (selectedColors.length < 2) {
        selectedColors.push(color);
        div.classList.add('selected');
    }
}

function calculateScore() {
    if (selectedColors.length !== 2) {
        alert(translations[document.getElementById('language').value].selectColorsAlert);
        return;
    }
    let userScore = 0;
    selectedColors.forEach(color => {
        if (colors.slice(10, 12).includes(color)) {
            userScore++;
        }
    });
    score = userScore;
    const language = document.getElementById('language').value;
    scoreDiv.textContent = translations[language].scoreText + " " + score;

    const difficulty = document.getElementById('difficulty').value;

    dataLayer.push({
        'event': 'score_calculated',
        'score': score,
        'difficulty': difficulty
    });
}


calculateScoreButton.addEventListener('click', calculateScore);

resetButton.addEventListener('click', resetGame);

function resetGame() {
    scoreDiv.textContent = '';
    generateColors();
    displayColors(colorPanel, colors.slice(0, 10));
    generateTestColors();
    displayColors(testPanel, testColors, true);
    selectedColors = [];
}

// Initialize the game
resetGame();