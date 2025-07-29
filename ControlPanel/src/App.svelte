<script>
  import ControlPanel from './ControlPanel.svelte';
</script>

<main>
  <ControlPanel />
</main>

<style>
  main {
    background: url('./assets/RLSS-Control-Panel.png') no-repeat center center;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    width: 100%;
    background-color: #eaeaea;
    font-family: sans-serif;
  }
</style>
