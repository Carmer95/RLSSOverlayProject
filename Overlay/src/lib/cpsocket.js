// cpcontrolSocket.js — WebSocket client for panelData server (App 2)

import { writable } from 'svelte/store';

export const panelDataStore = writable({
  currentGame: 1,
  bestOf: 1,
  blueWins: 0,
  orangeWins: 0,
  panelBlueTeamName: '',
  panelOrangeTeamName: '',
  blueLogo: '',
  orangeLogo: '',
  startSeries: false,
  seriesOver: false,
  seriesInfo: '', 
  overlayVisible: false,
});

export const panelSocketStatus = writable("disconnected");

export let controlSocket;

function connectWebSocket() {
  controlSocket = new WebSocket("ws://localhost:1234");

  controlSocket.onopen = () => {
    console.log("[Panel WS] Connected");
    panelSocketStatus.set("connected");
  };

  controlSocket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "panelData" && message.data) {
        panelDataStore.set(message.data);
        console.log("[Panel WS] Received panelData:", message.data);
      }
    } catch (e) {
      console.error("[Panel WS] Failed to parse message:", e);
    }
  };

  controlSocket.onerror = (e) => {
    console.error("[Panel WS] Error:", e);
  };

  controlSocket.onclose = () => {
    console.warn("[Panel WS] Disconnected. Reconnecting in 2s...");
    panelSocketStatus.set("disconnected");
    setTimeout(connectWebSocket, 2000);
  };
}

connectWebSocket(); // Autoconnect on import
