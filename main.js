const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startWebSocketServer } = require('./server.cjs');
const express = require('express');

// 🔄 Hot reload for Electron main process
if (process.env.NODE_ENV === 'development') {
  try {
    const electronPath = require('electron');
    require('electron-reload')(__dirname, {
      electron: electronPath,
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  } catch (_) {
    console.log('Electron reload not enabled');
  }
}


function createControlWindow() {
  const controlWin = new BrowserWindow({
    width: 1680,
    height: 1000,
    icon: path.join(__dirname, 'RLSS_Icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 🔵 Load dev server in development, static file in production
  if (process.env.NODE_ENV === 'development') {
    controlWin.loadURL('http://localhost:1111'); // Svelte Vite dev server
  } else {
    controlWin.loadURL('http://localhost:1112'); // Control panel
  }
}

function createOverlayWindow() {
  const overlayWin = new BrowserWindow({
    width: 1680,
    height: 1000,
    icon: path.join(__dirname, 'RLSS_Icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 🔵 Load dev server in development, static file in production
  if (process.env.NODE_ENV === 'development') {
    overlayWin.loadURL('http://localhost:1111'); // Svelte Vite dev server
  } else {
    overlayWin.loadURL('http://localhost:1111');
  }
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
  overlayApp.use('/TeamLogos', express.static(logosPath));
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
  createControlWindow();
  createOverlayWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
