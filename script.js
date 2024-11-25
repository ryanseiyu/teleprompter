const { ipcRenderer } = require('electron');

let currentTeleprompter = "index.html";
let fontSize = 24; // Initial font size in pixels
let isBlack = false; // Initial text color state

ipcRenderer.on('transcription-result', (event, transcription) => {
    const transcriptionDiv = document.getElementById('transcription-result');
    transcriptionDiv.textContent = transcription.text; // Assuming the transcription text is in the 'text' property
});

const teleprompters = [
    "index.html",
    "teleprompter1.html",
    "teleprompter2.html",
    "teleprompter3.html",
];
const teleprompterContent = {};

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
    console.log("toggleTextColor called"); // Debug log
    const teleprompter = document.querySelector(".teleprompter");
    console.log("teleprompter: ", teleprompter); // Debug log
    console.log("isBlack: ", isBlack); // Debug log
    if (teleprompter) {
        const paragraphs = teleprompter.querySelectorAll("p");
        paragraphs.forEach((p) => {
            if (isBlack) {
                p.style.color = "rgb(255, 255, 255)"; // Change to white
            } else {
                p.style.color = "rgb(0, 0, 139)"; // Change to darker red
            }
        });
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


