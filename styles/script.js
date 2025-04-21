//these values are taking the html elements and renaming them for Javascript
const displayedText = document.getElementById('displayed-text');
const userInput = document.getElementById('user-input');
const timeDisplay = document.getElementById('time');
const errorsDisplay = document.getElementById('errors');
const bookSelector = document.getElementById('book-selector');



// these are the itital values being set at zero
let startTime;
let errors = 0;
let text = ""; // Initialize text variable

const bookTexts = {
    sample: "This is some sample text. Type it as fast as you can!",
    book1: 'text/chapter1.txt',
    book2: "And here is the text for book number 2. Add your own books!",
};

async function loadText(bookKey) {
    const filePath = bookFilePaths[bookKey];
    if (filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            text = await response.text();
            displayHighlightedText("");
            userInput.value = "";
            userInput.disabled = false;
            startTime = null;
            errors = 0;
            errorsDisplay.textContent = errors;
            timeDisplay.textContent = "0";
            displayHighlightedText("");
        } catch (error) {
            console.error("Could not load text:", error);
            displayedText.textContent = "Error loading text.";
        }
    } else {
        text = "";
        displayedText.textContent = "";
    }
}

function displayHighlightedText(inputText) {
    let highlighted = '';
    for (let i = 0; i < text.length; i++) {
        if (i < inputText.length && inputText[i] !== text[i]) {
            highlighted += `<span class="error">${text[i]}</span>`;
        } else {
            highlighted += text[i];
        }
    }
    displayedText.innerHTML = highlighted;
}

bookSelector.addEventListener('change', (event) => {
    loadText(event.target.value);
});

userInput.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
    }

    const inputText = userInput.value;
    let currentErrors = 0;
    
//checks if the thing typed matches the spot in the text, if not it notes it
     for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] !== text[i]) {
            currentErrors++;
        }
    }
    errors = currentErrors;

    errorsDisplay.textContent = errors;
    displayHighlightedText(inputText);

   if (inputText === text) {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        timeDisplay.textContent = timeTaken.toFixed(2);
        userInput.disabled = true;
    }
});

loadText(bookSelector.value); // Load initial text






