<script>
  import { onMount, onDestroy } from 'svelte';

  let ws;
  let countdown = 0, countdownInterval;

  let currentGame = 1, bestOf = 5;
  let blueWins = '', orangeWins = '';
  let panelBlueTeamName = '', panelOrangeTeamName = '';
  let blueLogoUrl = '', orangeLogoUrl = '';
  let manualGameNumber = '', bestOfValue = '3';
  let message = '', startSeries = false;
  let seriesInfo = '', blueLogoFileInput;
  let orangeLogoFileInput, overlayVisible = false;
  let resetNoticeTimeout, resetNotice = '';

  // Connect to the WebSocket server to get live updates
  function connectWebSocket() {
    ws = new WebSocket('ws://localhost:1234');

    ws.onopen = () => {
      console.log('WebSocket connected to panel data server');
      message = 'Connected to server';
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'panelData') {
          // Update UI reactively from WS push data
          const data = msg.data;
          currentGame = data.currentGame ?? currentGame;
          bestOf = data.bestOf ?? bestOf;
          blueWins = data.blueWins?.toString() ?? blueWins;
          orangeWins = data.orangeWins?.toString() ?? orangeWins;
          panelBlueTeamName = data.panelBlueTeamName?.toString() ?? panelBlueTeamName;
          panelOrangeTeamName = data.panelOrangeTeamName?.toString() ?? panelOrangeTeamName;
          blueLogoUrl = data.blueLogo?.toString() ?? blueLogoUrl;
          orangeLogoUrl = data.orangeLogo?.toString() ?? orangeLogoUrl;
          startSeries = data.startSeries ?? false;
          seriesInfo = data.seriesInfo?.toString() ?? seriesInfo;
          manualGameNumber = currentGame.toString() ?? manualGameNumber;
          bestOfValue = bestOf.toString() ?? bestOfValue;
          overlayVisible = data.overlayVisible;
          message = 'Data updated from server';
          console.log('Received panelData via WS:', data);

          if (msg.data.seriesOver === true) {
            countdown = 70;
            clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
              if (--countdown <= 0) clearInterval(countdownInterval);
            }, 1000);
          } else if (msg.data.seriesOver === false && msg.data.startSeries === false) {
            startSeries = false;
            message = 'Series reset — ready to start';
            clearInterval(countdownInterval);
          }
        }
      } catch (err) {
        console.error('WS message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      message = 'WebSocket error occurred';
    };

    ws.onclose = () => {
      console.log('WebSocket closed, attempting reconnect in 3 seconds...');
      message = 'Disconnected from server, reconnecting...';
      setTimeout(connectWebSocket, 3000);
    };
  }

   function sendData(payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      message = 'WebSocket not connected';
    }
  }

  // function incrementGame() {
  //   if (currentGame >= bestOf) {
  //     message = `Cannot increment — current game (${currentGame}) >= Best Of (${bestOf})`;
  //     return;
  //   }
  //   sendData({ incrementGame: true });
  // }

  function setSeriesInfo() {
    const trimmed = seriesInfo.trim();
    console.log('Sending seriesInfo:', trimmed);
    if (trimmed.length > 0) {
      sendData({ seriesInfo: trimmed });
    }
  }

  function resetGame() {
    sendData({ resetGame: true });
  }

  function setGameNumber() {
    const num = parseInt(manualGameNumber);
    if (!isNaN(num)) {
      sendData({ setGameNumber: num });

      // If game is reset to 1, reset series state too
      if (num === 1) {
        sendData({
          blueWins: 0,
          orangeWins: 0,
          startSeries: false,
          seriesOver: false,
        });

        resetNotice = 'Series has been reset';
        clearTimeout(resetNoticeTimeout);
        resetNoticeTimeout = setTimeout(() => {
          resetNotice = '';
        }, 5000);
      }

      manualGameNumber = '';
    }
  }

  function setBestOf() {
    const num = parseInt(bestOfValue);
    if (!isNaN(num)) {
      sendData({ bestOf: num });
      bestOfValue = '';
    }
  }

  function setBlueWins() {
    const num = parseInt(blueWins);
    if (!isNaN(num)) {
      sendData({ blueWins: num });
      blueWins = '';
    }
  }

  function setOrangeWins() {
    const num = parseInt(orangeWins);
    if (!isNaN(num)) {
      sendData({ orangeWins: num });
      orangeWins = '';
    }
  }

  function setPanelBlueTeamName() {
    const trimmed = panelBlueTeamName.trim();
    if (trimmed.length > 0) {
      sendData({ panelBlueTeamName: trimmed });
    }
  }

  function setPanelOrangeTeamName() {
    const trimmed = panelOrangeTeamName .trim();
    if (trimmed.length > 0) {
      sendData({ panelOrangeTeamName : trimmed });
    }
  }

  function resetPanelBlueTeamName() {
    sendData({ panelBlueTeamName: '' });
    panelBlueTeamName = '';
  }

  function resetPanelOrangeTeamName() {
    sendData({ panelOrangeTeamName: '' });
    panelOrangeTeamName = '';
  }

  function handleBlueLogoFile(event) {
    const file = event.target.files[0];
    if (file) {
      const filename = file.name;
      blueLogoUrl = filename;
      sendData({ blueLogo: filename });
    }
  }

  function handleOrangeLogoFile(event) {
    const file = event.target.files[0];
    if (file) {
      const filename = file.name;
      orangeLogoUrl = filename;
      sendData({ orangeLogo: filename });
    }
  }

  function startSeriesNow() {
    overlayVisible = null;
    sendData({ 
      startSeries: true,
      overlayVisible: null
    });
  }

  onMount(() => {
    connectWebSocket();
  });

  onDestroy(() => {
    if (ws) ws.close();
  });

  $: seriesStarted =
  startSeries === true ||
  currentGame > 1 ||
  +blueWins > 0 ||
  +orangeWins > 0;

  $: if (seriesStarted && !startSeries) {
    sendData({ startSeries: true });
  }

</script>

<div class="panel">
  <div class="panelTitle">
    <h2>Game Control Panel</h2>
  </div>
  <div class="overlayControl">
    <p class="overlayStatus" style="margin-top: 0.5rem;">
      Overlay Mode: 
      {#if overlayVisible === true}
        <span style="color: green;">Manual (Shown)</span>
      {:else if overlayVisible === false}
        <span style="color: red;">Manual (Hidden)</span>
      {:else}
        <span style="color: orange;">Auto</span>
      {/if}
    </p>
    <div class="overlayButtons">
      <button 
      class="overlayButton"
      on:click={() => {
        overlayVisible = !overlayVisible;
        sendData({ overlayVisible });
      }}
      >
      {overlayVisible ? '🛑 Hide Overlay' : '✅ Show Overlay'}
      </button>

      <button 
        class="overlayButton"
        on:click={() => {
          console.log('Auto Overlay button clicked');
          overlayVisible = null;
          sendData({ overlayVisible: null });
        }}
        >
        ↩️ Auto Overlay
      </button>
    </div>
  </div>

  <p style="margin-top: 0.5rem; font-weight: bold;">
    Game {currentGame} of Bo{bestOf}
  </p>

  <button class="startSeriesButton" on:click={startSeriesNow} disabled={seriesStarted}>
  ✅ Start Series
</button>
  {#if startSeries}
    <p class="startSeries" style="color: green;">Series has started</p>
  {/if}
  <button class="resetSeriesButton" on:click={resetGame}>🔁 Reset Series</button>

  <div class="manual-set-i">
    <div class="manual-set">
      <label for="seriesInfoInput">League / Series Info:</label>
      <input
        id="seriesInfoInput"
        type="text"
        bind:value={seriesInfo}
        placeholder="RLSS Season 7 | Upper Finals"
      />
      <button on:click={setSeriesInfo}>Set</button>
      <button on:click={() => {
        sendData({ seriesInfo: '' });
        seriesInfo = '';
      }}>Reset</button>
    </div>
  </div>
  
  <div class="manual-set-t">
    <div class="manual-set">
      <label for="blueLogoInput">Blue Logo:</label>
      <input 
        id="blueLogoInput" 
        type="file" 
        accept="image/*" 
        on:change={handleBlueLogoFile}
        bind:this={blueLogoFileInput} />
      <button on:click={() => {
        sendData({ blueLogo: '' });
        blueLogoUrl = '';
        if (blueLogoFileInput) blueLogoFileInput.value = '';
      }}>Reset</button>
    </div>

    <div class="manual-set">
      <label for="orangeLogoInput">Orange Logo:</label>
      <input 
        id="orangeLogoInput" 
        type="file" 
        accept="image/*" 
        on:change={handleOrangeLogoFile}
        bind:this={orangeLogoFileInput} />
      <button on:click={() => {
        sendData({ orangeLogo: '' });
        orangeLogoUrl = '';
        if (orangeLogoFileInput) orangeLogoFileInput.value = '';
      }}>Reset</button>
    </div>

    <div class="manual-set">
      <label for="blueNameInput">Blue Team Name:</label>
      <input 
        id="blueNameInput" 
        type="text" 
        bind:value={panelBlueTeamName} 
        placeholder="Heady Scarf Gang" />
      <button on:click={setPanelBlueTeamName}>Set</button>
      <button on:click={resetPanelBlueTeamName}>Reset</button>
    </div>

    <div class="manual-set">
      <label for="orangeNameInput">Orange Team Name:</label>
      <input 
        id="orangeNameInput" 
        type="text" 
        bind:value={panelOrangeTeamName} 
        placeholder="Olivett Gaming" />
      <button on:click={setPanelOrangeTeamName}>Set</button>
      <button on:click={resetPanelOrangeTeamName}>Reset</button>
    </div>
  </div>

  <div class="manual-set-g">
    <div class="manual-set">
      <label for="bestOfInput">Best Of:</label>
      <input id="bestOfInput" type="number" autocomplete="off" bind:value={bestOfValue} min="1" />
      <button on:click={setBestOf}>Set</button>
    </div>

    <div class="manual-set">
      <label for="gameInput">Set Game #:</label>
      <input id="gameInput" type="number" autocomplete="off" bind:value={manualGameNumber} min="1" />
      <button on:click={setGameNumber}>Set</button>
    </div>
  </div>

  <div class="manual-set-w">
    <div class="manual-set">
      <label for="blueWinsInput">Blue Wins:</label>
      <input id="blueWinsInput" type="number" autocomplete="off" min="0" bind:value={blueWins} />
      <button on:click={setBlueWins}>Set</button>
    </div>

    <div class="manual-set">
      <label for="orangeWinsInput">Orange Wins:</label>
      <input id="orangeWinsInput" type="number" autocomplete="off" min="0" bind:value={orangeWins} />
      <button on:click={setOrangeWins}>Set</button>
    </div>
  </div>

  {#if message}
    <p style="margin-top: 1rem; color: green">{message}</p>
  {/if}

  {#if resetNotice}
    <p class="resetNotice" style="margin-top: 0.5rem; color: red;">{resetNotice}</p>
  {/if}

</div>

<style>
  .panelTitle{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 50px;

  }

  .overlayStatus{
    position: absolute;
    top: 94px;
    left: 630px;
  }

  h2, p {
    color: black;
  }

  .startSeries{
    position: absolute;
    margin: auto;
    margin-left: 330px;
    margin-top: -54px;
  }
  
  .resetNotice{
    position: absolute;
    margin: auto;
    margin-left: 314px;
    top: 200px;
  }

  .startSeriesButton{
    margin-right: 100px;
    margin-top: 4px;
  }

  .resetSeriesButton{
    margin-left: 100px;
    margin-top: 4px;
  }

  .panel {
    background-color: rgba(255, 255, 255, 0.2);
    padding: .3rem 1rem 1rem 1rem;
    border-radius: 10px;
    width: 65%;
    height: 850px;
    max-width: 800px;
    margin: 2rem auto;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
    font-family: sans-serif;
    text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 20px #000000;
    font-weight: 600;
  }

  .overlayButtons {
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin-right: 74px;
  }

  .overlayButton {
    font-size: 1rem;
    cursor: pointer;
  }

  button {
    margin: 0.5rem;
    margin-top: .5rem;
    padding: 0.4rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }

  .manual-set {
    display: flex;
    align-items: center; /* vertical centering */
    justify-content: center; /* optional: aligns contents to the left */
    gap: 0.5rem; /* spacing between elements */
    margin: 1rem 0;
  }

  .manual-set-i {
    margin: auto;
    width: 80%;
    margin-top: 1rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
  }

  .manual-set-t {
    margin: auto;
    width: 80%;
    margin-top: 1rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.6);
  }

  .manual-set-g {
    margin: auto;
    width: 60%;
    margin-top: 2rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.8);
  }

  .manual-set-w {
    margin: auto;
    width: 60%;
    margin-top: 2rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.8);
  }

  input {
    width: 60px;
    margin: 0 0.5rem;
    padding: 0.3rem;
  }

  #orangeLogoInput, #blueLogoInput, #blueNameInput, #orangeNameInput, #seriesInfoInput {
    width: 180px;
  }

  #seriesInfoInput {
    width: 240px;
  }

  label {
    color: black;
  }
</style>
