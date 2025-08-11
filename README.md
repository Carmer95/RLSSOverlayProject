# RLSSOverlayProject
The full RLSS Overlay Project by HSG Balthier
A custom overlay made for the Rocket League Splash Series and a Control Panel, powered by Svelte and Electron.

## 🔧 Features

- Custom Scorebug with Series Tracking (Best-of-x)
- Team Boost displays, Target Player Stat Card and Boost, all with real-time tracking
- Replay Screen with stats
- Postgame Screen with MVP highlighting and stat display
- Statfeed Events (Goals, Saves, Demos, etc.)
- WebSocket-driven updates (via BakkesMod + SOS plugin)
- Control Panel for real-time Overlay control including user uploaded Team Logos, Series information, visibility control, etc.
- Electron launcher for one-click startup
- Custom RLSS application icon

## 🚀 Getting Started

Prerequisites for users and devs: 
- Rocket League (Steam or Epic Games)
- BakkesMod
- SOS Plugin


Download and install Bakkesmod from the official website. Bakkesmod is required to run custom broadcast overlays in Rocket League. 

[BakkesMod](https://www.bakkesmod.com/)



To install the SOS plugin in Rocket League:

Ensure Bakkesmod is installed, then download the sos-plugin.

[SOS Plugin](https://gitlab.com/bakkesplugins/sos/sos-plugin). 

The SOS plugin allows game data to be sent from Rocket League to the overlay via web socket connection.


Extract the downloaded SOS plugin files and place them in the appropriate folders within the Bakkesmod directory. 

sos.dll in x:\Users\xxx\AppData\Roaming\bakkesmod\bakkesmod\plugins

sos.set in x:\Users\xxx\AppData\Roaming\bakkesmod\bakkesmod\plugins\settings


After following these steps, the SOS plugin should be successfully installed and ready to use with Bakkesmod. Verify in the BakkesMod Menu by pressing
f2 and opening the pluginmanager. Ensure Simple Overlay System - SOS.dll is checked. You may need to relaunch Rocket League and/or BakkesMod.

### 1. Download the App

If you just want to use the app:

👉 Go to the [RLSSOverlayProject](https://github.com/Carmer95/RLSSOverlayProject) repo page and download the .zip. You can do so by selecting the green "<> Code v" dropdown, and selecting "Download ZIP".

👉 Go to the [Releases](https://github.com/Carmer95/RLSSOverlayProject/releases) page and download `RLSS Overlay Launcher.exe`.  
Place the .exe in the /RLSSOverlayProject folder, run it, and spectate away!

---

### 2. Developer Setup

If you want to run from source:

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [BakkesMod](https://bakkesmod.com/) with the [Socket.IO Plugin (SOS)](https://gitlab.com/bakkesplugins/sos/sos-plugin)

---

#### Clone and Install

```bash
git clone https://github.com/Carmer95/RLSSOverlayProject.git
cd RLSSOverlayProject
npm install
cd Overlay
npm install
cd ..
cd ControlPanel
npm install
```

## ✏️ TEAM LOGOS

To input custom team logos, first ensure the logo is a .png. 
[x to PNG Converter](https://onlinepngtools.com/#tools)

A transparent background is recommended, as well as a circular format. 
[CircleCrop](https://crop-circle.imageonline.co/)

Once you have the properly formatted logo, place it in the /RLSSOverlayProject/TeamLogos directory. 

In the Control Panel, select "choose file" for the intended team, then select the file from the /TeamLogos directory, and the Overlay will update accordingly.
