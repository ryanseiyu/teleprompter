const { ipcRenderer } = require('electron');

document.getElementById('start-button').addEventListener('click', () => {
    ipcRenderer.invoke('start-transcription');
});

ipcRenderer.on('transcription-update', (event, text) => {
    const outputDiv = document.getElementById('output');
    outputDiv.innerText += `${text}\n`;
});
