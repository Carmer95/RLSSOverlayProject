<script>
  import {
    postGameVisible,
    blueTeam,
    orangeTeam,
    teamsStore,
    mvpPlayer,
    panelBlueTeamName,
    panelOrangeTeamName,
    postGameWinnerName
  } 
  from './Processor.js';
  import { fade, scale } from 'svelte/transition';
  import { onDestroy } from 'svelte';

  let show = false;
  const unsubscribe = postGameVisible.subscribe(value => show = value);
  onDestroy(() => unsubscribe());

// Store values
  let blue = {};
  let orange = {};
  let teams = {};
  let mvp = null;
  let winningTeam = null;

  // Auto-subscribe to store values
  $: blue = $blueTeam || {};
  $: orange = $orangeTeam || {};
  $: teams = $teamsStore || {};
  $: mvp = $mvpPlayer || null;

  // Names from panel overrides or fallback to in-game names
  $: blueName = (typeof $panelBlueTeamName === 'string' ? $panelBlueTeamName.trim() : '') || (blue.name || '');
  $: orangeName = (typeof $panelOrangeTeamName === 'string' ? $panelOrangeTeamName.trim() : '') || (orange.name || '');
  $: winnerName = (typeof $postGameWinnerName === 'string' ? $postGameWinnerName.trim() : '') || '';

  // Determine winning team by comparing winnerName to team names (case-insensitive)
  $: {
    const w = winnerName.toLowerCase();
    const b = blueName.toLowerCase();
    const o = orangeName.toLowerCase();

    if (w && w === b) {
      winningTeam = 0;
    } else if (w && w === o) {
      winningTeam = 1;
    } else {
      winningTeam = null;
    }
  }

  function nameSizeClass(name) {
    if (name.length > 20) return 'name-longest';
    if (name.length > 13) return 'name-long';
    return 'name-normal';
  }

  console.log('Winning Team:', winningTeam);
  console.log('MVP Player:', mvp);
</script>

{#if show}
  <div class="postgame-overlay" transition:fade>
    <div class="team-panel" class:winner={winningTeam === 0} transition:scale={{ duration: 400 }}>
      <h2>{$panelBlueTeamName}</h2>
      <p class="score">Goals: {blue.score ?? 0}</p>
      <div class="players">
        {#each Object.values(teams.blueTeam) as player}
          <div class="player-card" class:mvp={mvp && mvp.name === player.name && mvp.team === 0}>
            <div class = "name">
              <strong class={nameSizeClass(player.name)} title={player.name}>{player.name}</strong>
            </div>
            {#if mvp && mvp.name === player.name && mvp.team === 0}
              <span class="mvp-badge">⭐ MVP</span>
            {/if}
            <div class="p-score">Score: {player.score}</div>
            <div class="goals">Goals: {player.goals}</div>
            <div class="shots">Shots: {player.shots}</div>
            <div class="assists">Assists: {player.assists}</div>
            <div class="saves">Saves: {player.saves}</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="team-panel" class:winner={winningTeam === 1} transition:scale={{ duration: 400 }}>
      <h2>{$panelOrangeTeamName}</h2>
      <p class="score">Goals: {orange.score ?? 0}</p>
      <div class="players">
        {#each Object.values(teams.orangeTeam) as player}
          <div class="player-card" class:mvp={mvp && mvp.name === player.name && mvp.team === 1}>
            <div class = "name">
              <strong class={nameSizeClass(player.name)} title={player.name}>{player.name}</strong>
            </div>
            {#if mvp && mvp.name === player.name && mvp.team === 1}
              <span class="mvp-badge">⭐ MVP</span>
            {/if}
            <div class="p-score">Score: {player.score}</div>
            <div class="goals">Goals: {player.goals}</div>
            <div class="shots">Shots: {player.shots}</div>
            <div class="assists">Assists: {player.assists}</div>
            <div class="saves">Saves: {player.saves}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* .bg {
    background: url('../assets/RLSSPostGameBackground1.png') no-repeat center center;
    background-size: cover;
    width: 80%;
    height: 80%;
    margin: auto;
  } */

  .postgame-overlay {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4rem;
    background: url('../assets/RLSSPostGameBackground1.png') no-repeat center center;
    background-size: cover;
    padding: 2rem 3rem;
    color: white;
    z-index: 5;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    width: 1824px;
    height: 1020px;
    animation: slideIn 0.3s ease-out;
    flex-direction: row;
  }

  .team-panel {
    display: flex;
    flex-direction: column;
    margin-top: 140px;
    flex: 1;
    text-align: center;
    padding: 1rem;
    border-radius: 1rem;
    background-color: rgba(128, 128, 128, 0.3);
    transition: transform 0.3s ease;
    color: black;
    font-weight: 700;
    text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #000000;
    max-height: 800px;
  }

  .team-panel.winner {
    border: 3px solid gold;
    box-shadow: 0 0 20px gold;
    /* transform: scale(1.10); */
  }

  .score {
    font-size: 2rem;
    margin: 0.5rem 0 1.5rem;
  }

  .players {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .player-card {
    background: rgba(0, 0, 0, 0.2);
    padding: 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.9rem;
    transition: background 0.3s;
    height: 576px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .player-card:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .player-card.mvp {
    background: rgba(0, 162, 255, .8);
    color: black;
    box-shadow: 0 0 10px 3px rgb(0, 119, 255);
  }

  .mvp-badge {
    position: absolute;
    margin-top: 10px;
    top: 76px;
    background: gold;
    color: black;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.85rem;
    user-select: none;
    animation: pulse 1.2s infinite ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  h2 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    font-family: "Nosifer", serif;
  }

  .name{
    height: 50px;
    width: 250px;
    overflow: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: center;
    text-align: center;
    display: flex;
    justify-content: center;
    margin: 0;
    font-family: "Nosifer", serif;
  }

  .name-normal {
    font-size: 34px;
    max-width: 275px;
    overflow: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    font-family: "Nosifer", serif;
  }

  .name-long {
    font-size: 20px;
    max-width: 275px;
    overflow: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    font-family: "Nosifer", serif;
  }

  .name-longest {
    font-size: 20px;
    max-width: 275px;
    overflow: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    font-family: "Nosifer", serif;
  }

  .p-score {
    margin-top: 50px;
    font-size: 28px;
  }

  .goals {
    margin-top: 50px;
    font-size: 22px;
  }

  .shots {
    margin-top: 70px;
    font-size: 22px;
  }

  .assists {
    margin-top: 70px;
    font-size: 22px;
  }

  .saves {
    margin-top: 70px;
    font-size: 22px;
  }

</style>
