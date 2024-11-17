const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const { pipeline } = require('@huggingface/transformers');
const wavefile = require('wavefile');

let win;
let tray;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });
}

app.whenReady().then(async () => {
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
        win.show();
    });

    // Transcription pipeline
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');

    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    // Load audio data
    const url = 'https://voiceage.com/wbsamples/in_mono/Conference.wav';
    const buffer = Buffer.from(await fetch(url).then(x => x.arrayBuffer()));

    // Read .wav file and convert it to required format
    const wav = new wavefile.WaveFile(buffer);
    wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
    wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
        if (audioData.length > 1) {
            const SCALING_FACTOR = Math.sqrt(2);

            // Merge channels (into first channel to save memory)
            for (let i = 0; i < audioData[0].length; ++i) {
                audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
            }
        }

        // Select first channel
        audioData = audioData[0];
    }

    const start = performance.now();
    const output = await transcriber(audioData);
    const end = performance.now();
    console.log(`Execution duration: ${(end - start) / 1000} seconds`);
    console.log(output.text); // Log the transcribed text
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});