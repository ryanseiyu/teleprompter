const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const { createMainWindow, createSecondWindow } = require('./windows');


let tray = null;
let win = null;

app.whenReady().then(() => {
    createMainWindow();

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
            createMainWindow();
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