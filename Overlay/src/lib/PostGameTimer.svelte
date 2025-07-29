<script>
  import { onDestroy } from 'svelte';
  import { postGameTimerActive } from './Processor';
  import { writable } from 'svelte/store';

  const countdown = writable(60);
  let time = 60;
  let interval;

  const startTimer = () => {
    countdown.set(time = 60);
    clearInterval(interval);

    interval = setInterval(() => {
      time -= 1;
      countdown.set(time);

      if (time <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(interval);
  };

  // Reactively respond to changes in postGameTimerActive
  $: if ($postGameTimerActive) {
    startTimer();
  } else {
    stopTimer();
    countdown.set(60);
  }

  onDestroy(() => {
    stopTimer();
  });

  // Derived values for UI
  $: rawCountdown = time === 60 ? 60.01 : time;
  $: normalized = Math.min(Math.max(rawCountdown, 0), 60);
  $: scale = normalized / 60;
</script>

<!-- SVG Clip-path -->
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute; width:0; height:0; overflow:hidden;">
  <defs>
    <clipPath id="hourglass-clip" clipPathUnits="objectBoundingBox">
      <polygon points="
        0.5 0.0, 0.7 0.0, 0.67 0.113, 0.65 0.242,
        0.64 0.355, 0.64 0.468, 0.65 0.597, 0.67 0.726,
        0.69 0.790, 0.72 0.887, 0.77 1.0, 0.23 1.0,
        0.28 0.887, 0.31 0.790, 0.33 0.726, 0.35 0.597,
        0.36 0.468, 0.36 0.355, 0.35 0.242, 0.33 0.113,
        0.3 0.0
        " />
    </clipPath>
  </defs>
</svg>

<!-- Countdown UI -->
<div class="countdown-svg-container" aria-label="Postgame countdown timer">
  <div
    class="countdown-wrapper"
    style="clip-path: url(#hourglass-clip); -webkit-clip-path: url(#hourglass-clip);"
  >
    <div
      class="countdown-bar"
      style="height: {scale * 100}%"
    ></div>
    <div class="countdown-text">{Math.floor(time)}</div>
  </div>
</div>

<style>
  .countdown-svg-container {
    position: absolute;
    top: 30px;
    left: 390px;
    width: 220px;
    height: 84px;
    z-index: 10;
    pointer-events: none;
  }

  .countdown-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    color: white;
    text-shadow: 0 0 3px black;
  }

  .countdown-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(83, 200, 255, 0.5);
    transition: height 1s linear;
    z-index: 2;
  }

  .countdown-text {
    position: relative;
    z-index: 3;
    font-size: 20px;
    user-select: none;
  }
</style>
