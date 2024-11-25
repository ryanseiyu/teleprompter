const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const { createMainWindow, createSecondWindow, getMainWindow, getSecondWindow } = require('./windows');
const Microphone = require('node-microphone');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

let tray = null;

// Initialize the microphone
const mic = new Microphone();
let micStream;
let writeStream;

app.whenReady().then(() => {
    createMainWindow();
    const win = getMainWindow();
    const secondWin = getSecondWindow();

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
            label: 'Transcribe Audio',
            click: async () => {
                try {
                    const transcription = await query('output.wav');
                    console.log(transcription);
                    win.webContents.send('transcription-result', transcription);
                } catch (error) {
                    console.error('Error transcribing audio:', error);
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        },
    ]);

    async function query(filename) {
        const data = fs.readFileSync(filename);
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: data,
            }
        );
        const result = await response.json();
        return result;
    }

    tray.setToolTip('Teleprompter');
    tray.setContextMenu(contextMenu);

    globalShortcut.register('F7', () => {
        if (!micStream) {
            micStream = mic.startRecording();
            writeStream = fs.createWriteStream('output.wav');
            micStream.pipe(writeStream);
            console.log('Recording started');
        } else {
            mic.stopRecording();
            micStream = null;
            writeStream.end();
            console.log('Recording stopped and saved to output.wav');
        }
    });

    globalShortcut.register('F8', () => {
        if (win.isVisible()) {
            win.hide();
            if (secondWin && !secondWin.isDestroyed() && secondWin.isVisible()) {
                secondWin.hide();
            }
        } else {
            win.show();
            if (secondWin && !secondWin.isDestroyed()) {
                secondWin.show();
            }
            win.focus(); // Focus the win window
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