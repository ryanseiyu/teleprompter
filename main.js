const { app, BrowserWindow, screen, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createWindow() {
    const { height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: 800, // Full width
        height: height, // Full height
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true, // Do not show in taskbar
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

    globalShortcut.register('Alt+Left', () => {
        win.webContents.executeJavaScript('switchTeleprompter()');
    });

    globalShortcut.register('Alt+Right', () => {
        win.webContents.executeJavaScript('switchTeleprompter()');
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