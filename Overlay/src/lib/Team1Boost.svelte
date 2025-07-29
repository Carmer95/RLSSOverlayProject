<script>
    import {  blueTeam } from "../lib/Processor";

    export let percent = 33;
    export let color = $blueTeam.color_primary;
    export let demolished = false;

    // $: console.log(percent);
</script>

<div class="team1bg">
    <div class="boost bg" class:gray-boost={demolished}>
        <div class="boost" class:gray-boost={demolished} style:width={percent}% style:background-color={color} />
    </div>
</div>

<style>
    .team1bg {
        height: 50px;
        max-width: 300px;
        margin-bottom: 6px;
    }

    .boost {
        position: relative;
        height: 8px;
        background-color: #C26418;
        border-radius: 13px 13px 13px 13px;
        overflow: hidden;
    }

    .bg {
        width: 256px;
        background-color: #ffffff;
        border-radius: 13px 13px 13px 13px;
        box-shadow: 0px 1px 2px 1px rgba(0,0,0,0.9);
        top: 50px;
        left: 26px;
        direction: rtl;
    }

  .gray-boost {
    background-color: #777 !important;
  }

</style>