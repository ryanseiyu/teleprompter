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
                updatePosition();
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
    updatePosition();
    updateFontSize();
}

function updatePosition() {
    const teleprompter = document.querySelector(".teleprompter");
    if (teleprompter) {
        teleprompter.style.top = `${position}%`;
    }
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

function startScrolling() {
    scrolling = true;
    scrollInterval = setInterval(() => {
        position += -0.1; // Adjust the speed as needed
        updatePosition();
    }, 16); // Approximately 60 frames per second
}

function stopScrolling() {
    scrolling = false;
    clearInterval(scrollInterval);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && event.ctrlKey) {
        position -= 10; // Move up faster
    } else if (event.key === "ArrowDown" && event.ctrlKey) {
        position += 10; // Move down faster
    } else if (event.key === "ArrowUp") {
        position -= 0.5; // Move up
    } else if (event.key === "ArrowDown") {
        position += 0.5; // Move down
    } else if (event.key === "ArrowRight") {
        fontSize += 1; // Increase font size
    } else if (event.key === "ArrowLeft") {
        fontSize -= 1; // Decrease font size
    } else if (event.key === "F10") {
        toggleTextColor(); // Toggle text color
    } else if (event.key === " ") {
        if (scrolling) {
            stopScrolling();
        } else {
            startScrolling();
        }
    } else if (event.key === "PageUp") {
        position = 0; // Move to the top of the document
    } else if (event.key === "PageDown") {
        position = 100; // Move to the bottom of the document
    }
    updatePosition();
    updateFontSize();
});

// Load all teleprompter content initially
teleprompters.forEach(loadTeleprompter);