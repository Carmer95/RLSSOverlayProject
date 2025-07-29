<script>
  import InlineSvg from './InlineSvg.svelte';
  import { fly } from "svelte/transition";
  export let event;

  function getImage(eventName) {
    if (!eventName) return '';
    const safeName = eventName.toLowerCase().replace(/\s+/g, '_');
    return `/stat-icons/${safeName}.svg`;
  }

  function hexToRgba(hex, alpha = 0.7) {
    if (!hex || hex.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  $: iconClass = event.event?.toLowerCase().replace(/\s+/g, '-') || '';

</script>

<div
  class="statfeed-container"
  style="background-color: {hexToRgba(event.teamColor)}"
  in:fly={{ x: 50, duration: 200 }}
>
  <div class={`statfeed-icon ${iconClass}`}>
    <InlineSvg src={getImage(event.event)} />
  </div>
  <p class="statfeed-text">
    <strong>{event.name}</strong>
  </p>
</div>

<style>
  .statfeed-container {
    padding: 0px 8px;
    margin-bottom: 2px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
    z-index: 999;
    justify-content: start;
    height: 40px;
    overflow: auto;
  }

  .statfeed-icon {
    filter: brightness(0) invert(1);
    width: 50px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
		margin-right: -30px;
  }

	/* MVP & Win get larger treatment */
	.statfeed-icon.mvp {
		width: 70px;
		height: 37px;
		margin-top: 3px;
	}

	.statfeed-icon.win {
		width: 70px;
		height: 39px;
		margin-top: 1px;
		margin-left: -8px;
	}

	/* You could make a demo one pop */
	.statfeed-icon.demolish {
		animation: rotatePulse 1.2s infinite;
		height: 30px;
	}

	/* Or tweak assist coloring 
	.statfeed-icon.assist {
		filter: brightness(1) sepia(0.4) hue-rotate(180deg);
	} */

	/* Example animation */
	@keyframes rotatePulse {
		0% { transform: rotate(0deg) scale(1); }
		50% { transform: rotate(10deg) scale(1.05); }
		100% { transform: rotate(0deg) scale(1); }
	}

  :global(.statfeed-icon svg) {
    width: 100%;
    height: 100%;
  }

  .statfeed-text {
    font-size: 20px;
    color: white;
    font-weight: bold;
    text-shadow: 0 0 4px black;
    margin: 0px 30px 0px 30px;
  }

  @keyframes slideIn {
    from {
      transform: translateX(50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>