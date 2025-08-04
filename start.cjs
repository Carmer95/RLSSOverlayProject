const path = require("path");
const express = require("express");
const { startWebSocketServer } = require("./server.cjs");

async function main() {
  startWebSocketServer(1234);

  console.log("🚀 RLSS Overlay starting... Connect OBS to web-source 'http://localhost:1111'");

  // Overlay app on 1111
  const overlayApp = express();
  overlayApp.use(express.static(path.join(__dirname, "Overlay", "dist")));

  // Serve logos from ./TeamLogos
  overlayApp.use("/TeamLogos", express.static(path.join(process.cwd(), "TeamLogos")));

  overlayApp.listen(1111, () => {
    console.log("Overlay running at http://localhost:1111");
  });

  // Control panel app on 1112
  const controlApp = express();
  controlApp.use(express.static(path.join(__dirname, "ControlPanel", "dist")));
  controlApp.listen(1112, () => {
    console.log("Control Panel running at http://localhost:1112");
  });

  // Only try to open the browser if NOT running as pkg executable
  if (!process.pkg) {
    // Dynamically import and open if running normally (dev)
    const openModule = await import("open");
    const open = openModule.default;
    try {
      await open("http://localhost:1112");
    } catch (err) {
      console.warn("Could not auto-open browser:", err);
    }
  } else {
    // Inform user to open browser manually in packaged exe
    console.log("Please open http://localhost:1112 manually in your browser.");
  }
}

main().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});