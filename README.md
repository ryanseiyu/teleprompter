# Teleprompter Application

This is a teleprompter application built using Electron. It allows you to display and control teleprompter content on multiple windows.

## Features

- Load and display teleprompter content from HTML files
- Switch between different teleprompter files using keyboard shortcuts
- Adjust font size and toggle text color
- Control the application using a system tray menu
- Record audio using a microphone

## Requirements

### Set the Default Recording Device on Windows

1. Right-click on the speaker icon in the system tray and choose **Sounds**.
2. Go to the **Recording** tab.
3. Enable **Stereo Mix** (if available) or install drivers to enable it.
4. Set **Stereo Mix** as the default recording device.

### Install Sox

1. Download and install Sox from the official website: http://sox.sourceforge.net/
2. Add Sox to the environment variables:
   - Right-click on **This PC** or **Computer** on the desktop or in File Explorer and select **Properties**.
   - Click on **Advanced system settings**.
   - Click on the **Environment Variables** button.
   - In the **System variables** section, find the `PATH` variable and select it. Click **Edit**.
   - Add the path to the Sox installation directory (e.g., `C:\Program Files (x86)\sox-14-4-2`) to the `PATH` variable.
   - Click **OK** to close all dialog boxes.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/teleprompter.git
   cd teleprompter
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the application:

   ```sh
   npm start
   ```

2. Use the following keyboard shortcuts to control the teleprompter:
   - `ArrowRight`: Increase font size
   - `ArrowLeft`: Decrease font size
   - `F10`: Toggle text color
   - `Alt + ArrowLeft`: Switch to the previous teleprompter file
   - `Alt + ArrowRight`: Switch to the next teleprompter file
   - `F7`: Start/stop audio recording
   - `F8`: Show/hide the main and second windows
   - `F9`: Quit the application

## Packaging

To package the application for Windows:

```sh
npm run package
```

## Patch Notes

1.9 Added README.md

## Future Path Notes

1.10 Add model to read wav file
