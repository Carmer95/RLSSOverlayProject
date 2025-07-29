<script>
    export let percent = 33;
    export let color = '#b8d3ef';
</script>

<div class="circular-boost">
    <div class="one-third">
    <div class="one-third-one-third">
    </div>
    <div class="two-third-one-third">
    </div>
    </div>
    <div class="two-thirds">
    <div class="one-third-second-third">
    </div>
    <div class="two-third-second-third">
    </div>
    </div>
    <div class="one-third-third-third">
    </div>
    <div class="two-third-third-third">
    </div>
</div>

<div class="progress-circle " style="background: conic-gradient(from 180deg, {color} {percent * 2.7}deg, #b8d3ef {percent * 2.7}deg);"></div>

<!-- <div class="inside-circle">
</div> -->


<div class="boost-value-cont">
    <p class="boost-value">{percent}</p>
</div>

<style>
    .circular-boost {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 320px;
        height: 320px;
        z-index: 3;
        position: absolute;
        background-image: url('../assets/Boost_Meter_-_Transparent.png');
        background-position: 50% 50%;
        background-size: 100%;
    }

    .one-third {
        height: 2px;
        width: 22px;
        background-color: #000000;
        position: absolute;
        left: 38px;
        top: 166px;
    }

    .two-thirds {
        height: 22px;
        width: 2px;
        background-color: #000000;
        position: absolute;
        top: 49px;
        left: 151px;
    }

    .one-third-one-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        left: 54px;
        top: 96px;
         transform: rotate(120deg);
    }

    .two-third-one-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        left: 15px;
        top: 55px;
         transform: rotate(150deg);
    }

    .one-third-second-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        right: 88px;
        top: 61px;
         transform: rotate(210deg);
    }

    .two-third-second-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        right: 48px;
        top: 21px;
         transform: rotate(240deg);
    }

    .one-third-third-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        right: 107px;
        top: 68px;
         transform: rotate(300deg);
    }

    .two-third-third-third {
        height: 1.5px;
        width: 13px;
        background-color: #b8d3ef;
        position: absolute;
        right: 65px;
        top: 106px;
         transform: rotate(330deg);
    }

    /* Conic gradient progress starting from the bottom middle (180deg) */
    .progress-circle {
        top: 5px;
        right: 5px;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -2;
        position: absolute;
        opacity: 1;
        background: conic-gradient(rgb(0, 0, 255) 180deg, rgb(0, 0, 255) 90deg, rgb(0, 0, 255) 270deg); /* Dynamically updated */
        clip-path: polygon(50% 50%, 
                   50% 100%,
				   0% 100%,
				   0% 0%,
				   100% 0%,
				   100% 50%
				   );
    }

    .boost-value-cont {
        position: relative;
        height: 54px;
        width: 100px;
        display: flex;
        justify-content: center;
        top: 13px;
        right: 6px;
    }

    .boost-value {
        position: absolute;
        z-index: 4;
        font-size: 56px;
        font-weight: bolder;
        margin: auto;
        text-shadow: 0 0 5px #000000, 0 0 10px #000000, 0 0 3px #000000;
    }
</style>
