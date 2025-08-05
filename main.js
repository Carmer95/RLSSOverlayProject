const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startWebSocketServer } = require('./server.cjs');
const express = require('express');

function createWindow() {
  const win = new BrowserWindow({
    width: 1680,
    height: 1000,
    icon: path.join(__dirname, 'RLSS_Icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:1112');
}

app.whenReady().then(() => {
  // 🟢 Start WebSocket server
  startWebSocketServer(1234);

  // 🟣 Overlay Server
  const overlayApp = express();
  const logosPath = path.join(process.cwd(), 'TeamLogos');
  const fs = require('fs');
  
  if (!fs.existsSync(logosPath)) {
    fs.mkdirSync(logosPath, { recursive: true });
  }
  overlayApp.use('/TeamLogos', express.static(logosPath)); // Make logos accessible
  overlayApp.use(express.static(path.join(__dirname, 'Overlay', 'dist')));
  overlayApp.listen(1111, () => {
    console.log("Overlay running at http://localhost:1111");
  });

  // 🔵 Control Panel Server
  const controlApp = express();
  controlApp.use(express.static(path.join(__dirname, 'ControlPanel', 'dist')));
  controlApp.listen(1112, () => {
    console.log("Control Panel running at http://localhost:1112");
  });

  // 🖥️ Launch the Electron window
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});