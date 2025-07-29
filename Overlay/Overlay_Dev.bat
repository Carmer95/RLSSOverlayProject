@echo off
REM Start RLSS Overlay Backend
start "RLSS Overlay Backend" cmd /k "title RLSS Overlay Backend && cd /d C:\Users\carme\Documents\Programming\GitPlayground\RLSSOverlay && node server.js"

REM Start RLSS Overlay Dev Server
start "RLSS Overlay Dev" cmd /k "title RLSS Overlay Dev && cd /d C:\Users\carme\Documents\Programming\GitPlayground\RLSSOverlay && npm run dev"

REM Start RLSS Control Panel Dev Server
start "RLSS Control Panel Dev" cmd /k "title RLSS Control Panel Dev && cd /d C:\Users\carme\Documents\Programming\GitPlayground\RLSSOverlayControlPanel && npm run dev"

REM Exit this batch window so only the three named ones remain
exit
