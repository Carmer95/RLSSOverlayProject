<script>
  import { 
    orangeTeam, 
    blueTeam, 
    timeSeconds, 
    isOT, 
    postGameVisible
  } from "./Processor";
  import PostGameTimer from './PostGameTimer.svelte';
  import { panelDataStore } from "./cpsocket";
  import { fade } from "svelte/transition";

  // Format seconds to M:SS
  function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Reactive store subscriptions
  $: isPostGame = $postGameVisible;

  $: panel = $panelDataStore;
  $: currentGame = panel.currentGame;
  $: seriesInfo = panel.seriesInfo ?? '';

  $: blueDisplayName = panel.panelBlueTeamName?.trim() || $blueTeam?.name || 'Blue Team';
  $: orangeDisplayName = panel.panelOrangeTeamName?.trim() || $orangeTeam?.name || 'Orange Team';

  $: blueNameClass = blueDisplayName
    ? blueDisplayName.length < 5
      ? 'team-name abbreviation'
      : blueDisplayName.length > 12
      ? 'team-name small'
      : 'team-name'
    : 'team-name';

  $: orangeNameClass = orangeDisplayName
    ? orangeDisplayName.length < 5
      ? 'team-name abbreviation'
      : orangeDisplayName.length > 12
      ? 'team-name small'
      : 'team-name'
    : 'team-name';

  $: orangeScoreLeft = $orangeTeam.score >= 10 ? '564px' : '576px';
  $: blueScoreRight = $blueTeam.score >= 10 ? '564px' : '576px';

</script>

<div transition:fade class="top-bar">
  <div class="bgBox">
    {#if seriesInfo}
      <div class="series-info">{seriesInfo}</div>
    {/if}

    <!-- Blue Side -->
    <div class="blue-logo">
      <img class="blueLogo" src={`/TeamLogos/${panel.blueLogo || 'RLStockLogo.png'}`} alt="Blue Logo" width="90" height="90" />
    </div>
    <div class="blue-info">
      <div class="{blueNameClass}">{blueDisplayName}</div>
    </div>

    <!-- Game Center -->
    <div class="game">
      <div class="blue-score-bg">
        <div class="blue-score" style="right: {blueScoreRight}">{$blueTeam.score}</div>
      </div>

      {#if isPostGame}
        <PostGameTimer />
      {:else if $isOT}
        <div class="otTime">+{formatTime($timeSeconds)}</div>
      {:else}
        <div class="time">{formatTime($timeSeconds)}</div>
      {/if}

      <div class="orange-score-bg">
        <div class="orange-score" style="left: {orangeScoreLeft}">{$orangeTeam.score}</div>
      </div>
    </div>

    <!-- Orange Side -->
    <div class="orange-info">
      <div class="{orangeNameClass}">{orangeDisplayName}</div>
    </div>
    <div class="orange-logo">
      <img class="orangeLogo" src={`/TeamLogos/${panel.orangeLogo || 'RLStockLogo.png'}`} alt="Orange Logo" width="90" height="90" />
    </div>
  </div>

  <!-- Match Info -->
  <div class="match-info">
    <!-- Blue Wins -->
    <div class="team0Ws bWinBoxContainer">
      {#each Array(Math.ceil((panel.bestOf ?? 5) / 2)).fill(0).map((_, i) => i) as i (i)}
        <div class="winBox {((Math.ceil((panel.bestOf ?? 5) / 2) - 1 - i) < (panel.blueWins ?? 0)) ? 'blue active' : ''}"></div>
      {/each}
    </div>

    <div class="details">
      {#if $postGameVisible}
        Game Over
      {:else}
        Game {currentGame ?? '1'} | Best of {panel.bestOf ?? '1'}
      {/if}
    </div>

    <!-- Orange Wins -->
    <div class="team1Ws oWinBoxContainer">
      {#each Array(Math.ceil((panel.bestOf ?? 5) / 2)).fill(0).map((_, i) => i) as i}
        <div class="winBox {i < (panel.orangeWins ?? 0) ? 'orange active' : ''}"></div>
      {/each}
    </div>
  </div>
</div>

<style>
    .top-bar{
        height: 120px;
        width: 1080px;
        position: absolute;
        z-index: 6;
    }

    .series-info{
        position: absolute;
        top: -1px;
        margin: auto;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .blueLogo {
        object-fit: contain;
    }

    .orangeLogo {
        object-fit: contain;
    }

    .blue-logo {
        position: absolute;
        display: flex;
        top: 18px;
        left: 32px;
        font-size: 32px;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        background-position: 50% 50%;
        background-size: 100%;
    }

    .team-name {
        width: 230px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 28px;
        line-height: 1.1;
        padding: 0 4px;
        overflow: visible;
        word-break: break-word;
        white-space: normal;
        flex-direction: column;
        font-family: "Nosifer", serif;
        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, 0px 1px 0 #000, 1px 0px 0 #000;
        margin-top: 2px;
    }

    .team-name.small {
        font-size: 22px;
    }

    .team-name.abbreviation {
      margin-top: 4px;
      font-size: 36px;
      letter-spacing: 2px;
      transform: scale(1.05);
    }

    .blue-info {
        position: absolute;
        display: flex;
        top: 40px;
        left: 110px;
        font-size: 32px;
        justify-content: end;
        width: 250px;
    }

    .blue-score-bg {
        display: flex;
        justify-content: center;
        height: 120px;
        width: 60px;
        /* background-color: rgba(0, 2, 136, .8); */
        border-radius: 20%;
        margin-right: 16px;
    }

    .blue-score {
        font-size: 60px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 18px;
        right: 576px;
        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, 0px 1px 0 #000, 1px 0px 0 #000;
    }

    .game {
        position: absolute;
        margin: auto;
        font-size: 44px;
        display: flex;
        width: 100%;
        justify-content: center;
        height: 100%;
        align-items: center;
    }

    .time {
        position:absolute;
        top: 32px;
        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, 0px 1px 0 #000, 1px 0px 0 #000;
    }

    /* .countdown-container {
        position: absolute;
        width: 220px;
        height: 130px;
        top: 1px;
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        overflow: visible;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        color: white;
        text-shadow: 0 0 3px black;
        clip-path: polygon(50% 25%, 70% 25%, 67% 32%, 65% 40%, 64% 47%, 64% 54%, 65% 62%, 67% 68%, 69% 74%, 72% 80%, 77% 87%, 
        23% 87%, 28% 80%, 31% 74%, 33% 68%, 35% 61%, 36% 54%, 36% 47%, 35% 40%, 33% 32%, 
        30% 25%);
    }

    .countdown-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        transition: height 1s linear;
        border-radius: 12px 12px 0 0;
        z-index: 2;
    }

    .countdown-top-shape {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        
        
    }

    .countdown-text {
        position: relative;
        z-index: 3;
        font-size: 20px;
        user-select: none;
    } */


    .otTime {
        position:absolute;
        top: 38px;
        text-shadow: 0 0 10px #ff0000;
        font-size: 38px;
        left: 438px;
        width: 120px;
        display: flex;
        justify-content: center;
    }

    .orange-logo {
        position: absolute;
        display: flex;
        right: 32px;
        top: 18px;
        font-size: 30px;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
    }

    .orange-info {
        position: absolute;
        display: flex;
        right: 110px;
        top: 40px;
        font-size: 32px;
        justify-content: start;
        width: 250px;
    }

    .orange-score-bg {
        display: flex;
        justify-content: center;
        height: 120px;
        width: 60px;
        /* background-color: rgba(255, 115, 0, .8); */
        border-radius: 20%;
        margin-left: 16px;
    }

    .orange-score {
        font-size: 60px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 18px;
        left: 576px;
        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, 0px 1px 0 #000, 1px 0px 0 #000;
    }

    .match-info {
        position: absolute;
        z-index: 5;
        margin: auto;
        top: 120px;
        left: 615px;
        width: 690px;
        height: 20px;
        background-color: #000;
        display: flex;
        justify-content: center;
        margin: auto;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0);
        color: rgb(255, 255, 255);
        text-shadow: 0 0 5px #FFF, 0 0 20px #000000;
    }

    .details {
        /* position: absolute; */
        width: 140px;
        margin-top: 8px;
        margin-right: 1px;
        /* top: 3px;
        left: 282px; */
        font-weight: 800;
        font-size: 12.5px;
        text-shadow: -1.6px -1.6px 0 rgba(0, 0, 0, 0.5), 1.6px -1.6px 0 rgba(0, 0, 0, 0.5), -1.6px 1.6px 0 rgba(0, 0, 0, 0.5), 1.6px 1.6px 0 rgba(0, 0, 0, 0.5);
        font-family: "Exo 2", sans-serif;
    }

    .bWinBoxContainer {
        /* position: absolute; */
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 4px; /* space between boxes */
        justify-content: flex-end;
        margin-top: 14px;
        margin-right: 12px;
        /* left: 170px; */
    }

    .oWinBoxContainer {
        /* position: absolute; */
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 4px; /* space between boxes */
        justify-content: flex-start;
        margin-top: 14px;
        margin-left: 14px;
        /* right: 170px; */
    }
    
    .winBox {
        width: 15px;
        height: 15px;
        margin: 2px;
        border-radius: 10px;
        background-color: transparent;
        border: 1px solid #fff;
        transition: background-color 0.3s ease, border 0.3s ease;
    }

    /* Active (filled) win boxes for each team */
    .winBox.active.blue {
        background-color: #000288;
    }

    .winBox.active.orange {
        background-color: #ff7300;
    }

    .bgBox {
        position: relative;
        z-index: 5;
        border-radius: 7px 7px 23px 23px;
        width: 1000px;
        height: 164px;
        left: 420px;
        color: rgb(255, 255, 255);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        font-weight: bold;
        color: #000;
        /* box-shadow: 0px 5px 8px 0px rgba(0,0,0,0.9); */
        text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #000000, 
        0 0 30px #000000;
        background: url('../assets/RLSS_Scorebug.png') no-repeat center center;
        background-size: 100% 306%;
    }

    

</style>