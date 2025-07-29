import { writable, derived, get } from 'svelte/store';
import { socketMessageStore } from './socket';
import { panelDataStore } from './cpsocket';
import { controlSocket } from './cpsocket';

// --- Visibility toggles ---
export const showTargetPlayer = writable(true);
export const showBoost = writable(true);
export const showScorebug = writable(true);
export const showTeams = writable(true);

// Live game state from SOS
export const updateState = derived(socketMessageStore, ($msg, set) => {
  if ($msg?.event === 'game:update_state') {
    set($msg.data);
  }
});

// Time remaining
export const timeSeconds = derived(updateState, ($update, set) => {
  set($update?.game?.time_seconds ?? null);
});

// Teams
export const blueTeam = derived(updateState, ($update, set) => {
  set($update?.game?.teams?.[0] ?? {});
});
export const orangeTeam = derived(updateState, ($update, set) => {
  set($update?.game?.teams?.[1] ?? {});
});

export const postGameWinnerName = writable(null);

// Target player stores
const rawTargetPlayer = derived(updateState, ($update, set) => {
  if ($update?.game?.hasTarget) {
    set($update.players[$update.game.target]);
  } else {
    set(null);
  }
});

// Persistent store
export const targetPlayer = writable({});

// Update the targetPlayer only if valid data is available
rawTargetPlayer.subscribe((player) => {
  if (
    player &&
    typeof player.name === 'string' &&
    player.name.trim() !== '' &&
    player.team !== -1 &&
    player.id
  ) {
    targetPlayer.set(player);
  } else {
    targetPlayer.set(null); // Clear if player is invalid
  }
});

// Store for stacking events
export const statfeedEvents = writable([]);

export const demolishedPlayers = writable([]);

// Grouped players by team
export const teamsStore = derived(updateState, ($update, set) => {
  if (!$update?.players) return;

  const blueTeam = {};
  const orangeTeam = {};

  for (const id in $update.players) {
    const player = $update.players[id];
    (player.team === 0 ? blueTeam : orangeTeam)[id] = player;
  }

  set({ blueTeam, orangeTeam });
});

// --- MVP Player ---
const rawMvpPlayer = derived(updateState, ($update, set) => {
  if ($update?.game?.hasTarget) {
    const players = $update.players;
    let best = null;

    for (const id in players) {
      const player = players[id];
      if (!best || player.score > best.score) {
        best = player;
      }
    }

    set(best || null);
  } else {
    set(null);
  }
});

// Persistent MVP store
export const mvpPlayer = writable({});

// Only update if the MVP data is valid
rawMvpPlayer.subscribe((player) => {
  if (player?.name && typeof player.name === 'string') {
    mvpPlayer.set(player);
  }
});

// Overtime + replay state + roundStart + overlayVisible
export const isOT = derived(updateState, ($update, set) => {
  set(Boolean($update?.game?.isOT));
});

export const isReplay = writable(false);
export const goalScoredEvent = writable(null);

export const roundStarted = writable(false);

export const seriesStarted = derived(panelDataStore, ($panelData) => {
  return (
    $panelData?.startSeries === true ||
    $panelData?.currentGame > 1 ||
    $panelData?.blueWins > 0 ||
    $panelData?.orangeWins > 0
  );
});

export const manualOverlayOverride = writable(null); // null = auto, otherwise true/false
const internalAutoOverlay = writable(false);

export const overlayVisible = derived(
  [manualOverlayOverride, internalAutoOverlay],
  ([$manual, $auto]) => $manual !== null ? $manual : $auto
);

export const shouldShowOverlay = overlayVisible;

// Keep overlayVisible in sync with panelDataStore updates
panelDataStore.subscribe(($panel) => {
  if ($panel && 'overlayVisible' in $panel) {
    manualOverlayOverride.set(
      $panel.overlayVisible === null ? null : Boolean($panel.overlayVisible)
    );
  }
});

// Follow updateState, but let us override manually too
updateState.subscribe(($update) => {
  if ($update?.game?.isReplay !== undefined) {
    isReplay.set($update.game.isReplay);

    // Automatically toggle target player and boost visibility during replay
    if ($update.game.isReplay) {
      showTargetPlayer.set(false);
      showBoost.set(false);
    } else {
      showTargetPlayer.set(true);
      showBoost.set(true);
    }
  }
});

// Post-game UI visibility
export const postGameVisible = writable(false);
export const podiumActive = writable(false);
export const postGameTimerActive = writable(false);

// Team name overrides or fallback to in-game names
export const panelBlueTeamName = derived(
  [panelDataStore, updateState],
  ([$panel, $update]) => {
    const override = $panel?.panelBlueTeamName?.trim();
    const inGame = $update?.game?.teams?.[0]?.name?.trim();
    return override || inGame || 'Blue';
  }
);

export const panelOrangeTeamName = derived(
  [panelDataStore, updateState],
  ([$panel, $update]) => {
    const override = $panel?.panelOrangeTeamName?.trim();
    const inGame = $update?.game?.teams?.[1]?.name?.trim();
    return override || inGame || 'Orange';
  }
);

// --- WebSocket-only update sender ---
function sendPanelUpdate(message) {
  if (controlSocket?.readyState === WebSocket.OPEN) {
    controlSocket.send(JSON.stringify(message));
  } else {
    console.warn('Panel socket not open. Cannot send:', message);
  }
}

// Game control + debounce + tracking

// --- Internal state ---
let lastHandledGameId = null;
let lastGameInit = 0;
let resetTimeout = null;
const DEBOUNCE_MS = 3000;

// --- Match logic ---
socketMessageStore.subscribe(($msg) => {
  if (!$msg?.event) return;
  const now = Date.now();

  if ($msg.event === 'game:match_created') {
    const panel = get(panelDataStore);

    // If the previous series was over, reset it now
    if (panel.seriesOver === true) {
      console.log('[Processor] New match created after series ended — resetting series immediately');
      sendPanelUpdate({ resetGame: true });
      postGameVisible.set(false);
      manualOverlayOverride.set(null);
      return; // Exit early to prevent other logic from running
    }
  }

  if ($msg.event === 'game:initialized') {
    const panel = get(panelDataStore);
    const initId = JSON.stringify($msg.data);

    if (get(manualOverlayOverride) === null) internalAutoOverlay.set(true);

    console.log('New game started. ', panel, ' ', initId, ' ', lastHandledGameId, ' ', lastGameInit );

    if (initId === lastHandledGameId || now - lastGameInit < 3000) return;

    lastHandledGameId = initId;
    lastGameInit = now;

    const isSeriesMode = panel.bestOf > 1;

    if ((isSeriesMode && !get(seriesStarted)) || panel.seriesOver === true) {
      console.log('[Processor] Series not started or already over.');
      return;
    }

    // Only increment if we're not already at bestOf
    const newGame = panel.currentGame + 1;
    let matchHasEnded = false;

    if(panel.blueWins > 0 || panel.orangeWins > 0){
      matchHasEnded = true;
    }
    
    console.log(newGame, matchHasEnded);
    
    if (newGame <= panel.bestOf && matchHasEnded === true) {
       sendPanelUpdate({ setGameNumber: newGame });
       console.log(`[Processor] Incremented currentGame to ${newGame}`);
    }
  }

  if ($msg.event === 'game:round_started_go') {
    roundStarted.set(true);
    setTimeout(() => {
      if (get(manualOverlayOverride) === null) internalAutoOverlay.set(true); // ✅ Show 3s after round starts
    }, DEBOUNCE_MS);
  }

  if ($msg.event === 'game:statfeed_event') {
    const { event_name, main_target, secondary_target } = $msg.data;
    console.log('[STATFEED]', event_name, main_target, secondary_target);

    // ✅ Demolish logic — update demolishedPlayers list
    if (
      event_name === 'Demolish' &&
      secondary_target?.id &&
      secondary_target?.name?.trim() !== ''
    ) {
      const demolished = {
        id: Date.now(),
        playerId: secondary_target.id,
        team: secondary_target.team_num,
      };

      demolishedPlayers.update((list) => [...list, demolished]);

      setTimeout(() => {
        demolishedPlayers.update((list) =>
          list.filter((p) => p.id !== demolished.id)
        );
      }, 3000);
    }

    if (event_name && main_target?.name) {
      const newEvent = {
        id: Date.now(), // unique ID
        name: main_target.name,
        event: event_name,
        team: main_target.team_num,
      };

      // Push to array and limit to 3
      statfeedEvents.update((events) => {
        const updated = [...events, newEvent];
        return updated.slice(-3); // Keep only last 3
      });

      // Remove after 3 seconds
      setTimeout(() => {
        statfeedEvents.update((events) =>
          events.filter((e) => e.id !== newEvent.id)
        );
      }, DEBOUNCE_MS);
    }
  }

  if ($msg.event === 'game:goal_scored') {
    const data = $msg.data;
    if (data?.scorer?.name) {
      goalScoredEvent.set({
        scorer: {
          name: data.scorer.name,
          id: data.scorer.id,
          team: data.scorer.teamnum
        },
        assister: {
          name: data.assister?.name || '',
          id: data.assister?.id || ''
        },
        speed: data.goalspeed,
        time: data.goaltime,
        lastTouch: data.ball_last_touch?.player || '',
        impactLocation: data.impact_location || null
      });
    }
  }

  if ($msg.event === 'game:post_countdown_begin') {
    console.log('[Processor] post_countdown_begin — Hiding overlay for 3s');
    internalAutoOverlay.set(false);

    setTimeout(() => {
      if (get(manualOverlayOverride) === null) internalAutoOverlay.set(true);
      console.log('[Processor] post_countdown_begin — Showing overlay again');
    }, 4000);
  }

  let lastHandledMatchEndId = null;
  let lastMatchEndTime = 0;

  if ($msg.event === 'game:match_ended') {
    const now = Date.now();
    const panel = get(panelDataStore);

    // Create a match-end ID based on event data
    const matchEndId = JSON.stringify($msg.data);

    // Debounce to avoid double handling
    if (matchEndId === lastHandledMatchEndId || now - lastMatchEndTime < 3000) {
      console.log('[Processor] Duplicate match_ended ignored.');
      return;
    }

    lastHandledMatchEndId = matchEndId;
    lastMatchEndTime = now;

    const winner = $msg.data?.winner_team_num;

    let winnerName = null;
    if (winner === 0) {
      winnerName = panel.panelBlueTeamName || get(blueTeam)?.name || 'Blue';
    } else if (winner === 1) {
      winnerName = panel.panelOrangeTeamName || get(orangeTeam)?.name || 'Orange';
    }
    postGameWinnerName.set(winnerName);

    let updated = false;

    const isSeriesMode = panel.bestOf > 1;

    if ((isSeriesMode && !get(seriesStarted)) || panel.seriesOver === true) {
      console.log('[Processor] Series not started or already over.');
      return;
    }

    if (winner === 0) {
      sendPanelUpdate({ blueWins: panel.blueWins + 1 });
      console.log('[Processor] Blue win incremented');
      updated = true;
    } else if (winner === 1) {
      sendPanelUpdate({ orangeWins: panel.orangeWins + 1 });
      console.log('[Processor] Orange win incremented');
      updated = true;
    }

    if (updated) {
      const requiredWins = Math.ceil(panel.bestOf / 2);
      const blueWins = winner === 0 ? panel.blueWins + 1 : panel.blueWins;
      const orangeWins = winner === 1 ? panel.orangeWins + 1 : panel.orangeWins;

      if (blueWins >= requiredWins || orangeWins >= requiredWins) {
        sendPanelUpdate({ seriesOver: true });
        console.log('[Processor] Series is over');
      }
    }
  }

  if ($msg.event === 'game:match_destroyed') {
    roundStarted.set(false);
    postGameVisible.set(false);
    manualOverlayOverride.set(null);
    isReplay.set(false);
    targetPlayer.set({});
    showTargetPlayer.set(true);
    showBoost.set(true);
    console.log('[Processor] match_destroyed — Overlay set to false');
  }

  if ($msg.event === 'game:podium_start') {
    console.log('Podium');
    manualOverlayOverride.set(null);
    podiumActive.set(true);

    const panel = get(panelDataStore);
    postGameTimerActive.set(false); // Reset
    postGameVisible.set(false);     // Reset
    console.log(panel)

    if (panel.seriesOver) {
      console.log('[Processor] Series complete — resetting in 70 seconds');
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        sendPanelUpdate({ resetGame: true });
        console.log('[Processor] Series reset after podium');
      }, 70000);
    }

    setTimeout(() => {
      postGameVisible.set(true);
      postGameTimerActive.set(true); 
      if (get(manualOverlayOverride) === null) internalAutoOverlay.set(true);
      podiumActive.set(false);

    }, 5000); // Postgame screen lasts 5 seconds, this allows team celebration before the overlay reappears
  }
});
