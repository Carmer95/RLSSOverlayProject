<script>
  export let src = '';
  let svgContent = '';

  import { onMount } from 'svelte';

  onMount(async () => {
    if (src) {
      try {
        const res = await fetch(src);
        svgContent = await res.text();
      } catch (err) {
        console.error('Error loading SVG:', err);
      }
    }
  });
</script>

{@html svgContent}