let currentTeleprompter = "index.html";
let fontSize = 24; // Initial font size in pixels
let isBlack = false; // Initial text color state

const teleprompters = [
    "index.html",
    "teleprompter1.html",
    "teleprompter2.html",
    "teleprompter3.html",
];
const teleprompterContent = {};

// Start recognition when the button is clicked
const startAudioButton = document.getElementById('start-audio');
startAudioButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance('Hello, world!');
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
});

// Stop recognition when the button is clicked
const stopAudioButton = document.getElementById('stop-audio');
stopAudioButton.addEventListener('click', () => {
    recognition.stop();
});

function loadTeleprompter(file) {
    fetch(file)
        .then((response) => response.text())
        .then((data) => {
            teleprompterContent[file] = data;
            if (file === currentTeleprompter) {
                document.getElementById("teleprompter-container").innerHTML = data;
                updateFontSize();
            }
        });
}

function switchTeleprompter(direction) {
    const currentIndex = teleprompters.indexOf(currentTeleprompter);
    const nextIndex = (currentIndex + 1) % teleprompters.length;
    const prevIndex = (currentIndex - 1 + teleprompters.length) % teleprompters.length;

    if (direction === "next") {
        currentTeleprompter = teleprompters[nextIndex];
    } else if (direction === "prev") {
        currentTeleprompter = teleprompters[prevIndex];
    }
    document.getElementById("teleprompter-container").innerHTML = teleprompterContent[currentTeleprompter];
    updateFontSize();
}

function updateFontSize() {
    const teleprompter = document.querySelector(".teleprompter");
    if (teleprompter) {
        teleprompter.style.fontSize = `${fontSize}px`;
    }
}

function toggleTextColor() {
    const teleprompter = document.querySelector(".teleprompter");
    if (teleprompter) {
        if (isBlack) {
            teleprompter.style.color = "rgb(255, 255, 255)"; // Change to white
        } else {
            teleprompter.style.color = "rgb(139, 0, 0)"; // Change to darker red
        }
        isBlack = !isBlack;
    }
}


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && !event.altKey) {
        fontSize += 1; // Increase font size
    } else if (event.key === "ArrowLeft" && !event.altKey) {
        fontSize -= 1; // Decrease font size
    } else if (event.key === "F10") {
        toggleTextColor(); // Toggle text color
    } else if (event.altKey && event.key === 'ArrowLeft') {
        switchTeleprompter("prev");
    } else if (event.altKey && event.key === 'ArrowRight') {
        switchTeleprompter("next");
    } updateFontSize();
});

// Load all teleprompter content initially
teleprompters.forEach(loadTeleprompter);


