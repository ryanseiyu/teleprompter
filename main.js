const { app, BrowserWindow, ipcMain } = require('electron');
const mic = require('mic');
const { pipeline } = require('@huggingface/inference');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
});

ipcMain.handle('start-transcription', async () => {
    // Initialize the mic instance
    const micInstance = mic({
        rate: '16000', // Audio sample rate
        channels: '1', // Single audio channel
        debug: true,   // Debug mode to track issues
        fileType: 'wav', // Output format
    });

    const micStream = micInstance.getAudioStream();

    // Initialize transcription pipeline
    const transcriptionPipeline = await pipeline('automatic-speech-recognition', 'openai/whisper-small');

    let transcript = '';

    // Start capturing audio
    micInstance.start();

    micStream.on('data', async (data) => {
        try {
            // Send audio chunk to the transcription pipeline
            const result = await transcriptionPipeline(data);
            transcript += result.text;

            // Send transcription update to the renderer process
            mainWindow.webContents.send('transcription-update', result.text);
        } catch (err) {
            console.error('Transcription error:', err);
        }
    });

    micStream.on('error', (err) => {
        console.error('Microphone stream error:', err);
    });

    ipcMain.once('stop-transcription', () => {
        // Stop the mic instance when transcription is stopped
        micInstance.stop();
    });
});
