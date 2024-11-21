const { BrowserWindow, screen, app } = require('electron');
const path = require('path');

let win;
let secondWin;

function createMainWindow() {
    const { height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: 600,
        height: height,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));

    win.on('minimize', (event) => {
        event.preventDefault();
        win.hide();
    });

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });

    createSecondWindow();

    win.focus();
}

function createSecondWindow() {
    const [winX, winY] = win.getPosition();
    const [winWidth] = win.getSize();

    secondWin = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    secondWin.loadFile(path.join(app.getAppPath(), 'index.html'));

    secondWin.setPosition(winX + winWidth, winY);

    secondWin.on('close', () => {
        secondWin = null;
    });
}

function getMainWindow() {
    return win;
}

function getSecondWindow() {
    return secondWin;
}

module.exports = { createMainWindow, createSecondWindow, getMainWindow, getSecondWindow };