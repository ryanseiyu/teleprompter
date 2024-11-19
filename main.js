const { app, BrowserWindow, screen, Tray, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let tray = null;
let win = null;
let secondWin = null;

function createWindow() {
    const { height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: 800, // Full width
        height: 0.9 * height, // Full height
        transparent: true,
        frame: true,
        alwaysOnTop: true,
        skipTaskbar: true, // Do not show in taskbar
        webPreferences: {
            nodeIntegration: true, // Enable node integration
            contextIsolation: false // Disable context isolation
        }
    });

    win.loadFile(path.join(app.getAppPath(), 'index.html'));

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

    // Focus on the first window
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

app.whenReady().then(() => {
    createWindow();

    tray = new Tray(path.join(app.getAppPath(), 'icon.png')); // Path to your tray icon
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                win.show();
            }
        },
        {
            label: 'Hide',
            click: () => {
                win.hide();
            }
        },
        {
            label: 'Open Second Window',
            click: () => {
                if (!secondWin) {
                    createSecondWindow();
                } else {
                    secondWin.show();
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Teleprompter');
    tray.setContextMenu(contextMenu);

    globalShortcut.register('F8', () => {
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
        }
    });

    globalShortcut.register('F9', () => {
        app.isQuiting = true;
        app.quit();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});