<script>
  import { blueTeam, orangeTeam, teamsStore, demolishedPlayers, goalScoredEvent } from "./Processor";
  import Scorebug from "./Scorebug.svelte";
  import Team0Boost from "./Team0Boost.svelte";
  import Team1Boost from "./Team1Boost.svelte";
</script>

<div class="replay-ui { $goalScoredEvent ? 'goal-fade' : '' }">
  {#if $goalScoredEvent}
    <div class="corner-fade"></div>

    <div class="goal-info">
    <div class="goal-details">
        <img src="/stat-icons/goal.svg" alt="Goal Icon" class="stat-icon" />
        <p class="scorer-name">{$goalScoredEvent.scorer.name}</p>

        <img src="/stat-icons/shot.svg" alt="Speed Icon" class="stat-icon" />
        <p class="speed">{Math.round($goalScoredEvent.speed)} km/h</p>

        {#if $goalScoredEvent.assister.name}
            <img src="/stat-icons/assist.svg" alt="Assist Icon" class="stat-icon" />
            <p class="assister-name">{$goalScoredEvent.assister.name}</p>
        {/if}
    </div>
    </div>
    <div class="goal-overlay">
        <div class="goal-overlay-trim">
        </div>
    </div>
  {/if}
</div>

<style>
.replay-ui {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.goal-overlay {
  position: absolute;
  z-index: -2;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 10px;
  width: 1920px;
  background: rgba(0, 132, 255, 0.6);
  height: 720px;
  clip-path: polygon(100% 80%, 80% 80%, 65% 85%, 35% 85%, 20% 80%, 0 80%, 0% 100%, 100% 100%);
  bottom: -10px;
}

.goal-overlay-trim {
  position: absolute;
  z-index: -2;
  bottom: 10px;
  background: rgba(49, 172, 255, 0.6);
  width: 1920px;
  height: 720px;
  clip-path: polygon(100% 80%, 80% 80%, 65% 85%, 35% 85%, 20% 80%, 0 80%, 0% 100%, 100% 100%);
  bottom: -10px;
}

.goal-info {
  position: absolute;
  text-align: center;
  color: white;
  z-index: 1;
  width: 1920px;
  bottom: 26px;
}

.goal-details {
  font-size: 1.25rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Nosifer", serif;
}

/* Red faded border corners */
.corner-fade {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at top left, rgba(255, 0, 0, 0.5), transparent 25%),
    radial-gradient(circle at top right, rgba(255, 0, 0, 0.5), transparent 25%),
    radial-gradient(circle at bottom left, rgba(255, 0, 0, 0.5), transparent 25%),
    radial-gradient(circle at bottom right, rgba(255, 0, 0, 0.5), transparent 25%);
}

.scorer-name {
    font-family: "Nosifer", serif;
    margin: 4px 40px 0px 10px;
}

.speed {
    font-family: "Nosifer", serif;
    margin: 4px 40px 0px 10px;
}

.assister-name {
    font-family: "Nosifer", serif;
    margin: 4px 40px 0px 10px;
}

.stat-icon {
  height: 40px;
  width: 40px;
  margin-right: 8px;
  margin-left: 20px;
  vertical-align: middle;
  filter: brightness(0) invert(1);
}

</style>
