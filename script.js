let currentTeleprompter = "teleprompter1.html";
let position = 0; // Initial position at the top
let fontSize = 24; // Initial font size in pixels
let isBlack = false; // Initial text color state
let scrolling = false; // Initial scrolling state
let scrollInterval; // Interval ID for scrolling
const teleprompters = [
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