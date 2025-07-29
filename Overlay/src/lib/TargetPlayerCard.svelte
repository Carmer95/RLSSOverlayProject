<script>
    import { targetPlayer, mvpPlayer  } from "./Processor";
    export let teamColor = '';
    console.log('Team color received in TargetPlayerCard:', teamColor);

    // if ($targetPlayer.team == 0) {
    //     const name = document.getElementById('name')

    //     name.style.backgroundColor = "blue";
    // }

    $: nameLengthClass = $targetPlayer?.name
    ? $targetPlayer.name.length > 9
    ? 'player-name-l'
    : $targetPlayer.name.length > 5
    ? 'player-name-m'
    : $targetPlayer.name.length > 1
    ? 'player-name-s'
    : ''
    : '';

</script>

{#if $targetPlayer?.name}
    {#if $targetPlayer.team === 0}
        <div class="b-stats">
            <div class={`b-name ${nameLengthClass}`}>
                {$targetPlayer.name}
                {#if $mvpPlayer?.id === $targetPlayer.id && $mvpPlayer.score > 0}
                    <span class="mvp-badge">MVP</span>
                {/if}
            </div>
            <div class="category">
                <li class="score">Score</li>
                <li class="goals">Goals</li>
                <li class="shots">Shots</li>
                <li class="assists">Assists</li>
                <li class="saves">Saves</li>
            </div>
            <div class="value">
                <li class="score-val"><div>{$targetPlayer.score}</div></li>
                <li class="goals-val"><div>{$targetPlayer.goals}</div></li>
                <li class="shots-val"><div>{$targetPlayer.shots}</div></li>
                <li class="assists-val"><div>{$targetPlayer.assists}</div></li>
                <li class="saves-val"><div>{$targetPlayer.saves}</div></li>
            </div>
        </div>
    {:else}
        <div class="o-stats">
            <div class={`o-name ${nameLengthClass}`}>
                {$targetPlayer.name}
                {#if $mvpPlayer?.id === $targetPlayer.id && $mvpPlayer.score > 0}
                    <span class="mvp-badge">MVP</span>
                {/if}
            </div>
            <div class="category">
                <li class="score">Score</li>
                <li class="goals">Goals</li>
                <li class="shots">Shots</li>
                <li class="assists">Assists</li>
                <li class="saves">Saves</li>
            </div>
            <div class="value">
                <li class="score-val"><div>{$targetPlayer.score}</div></li>
                <li class="goals-val"><div>{$targetPlayer.goals}</div></li>
                <li class="shots-val"><div>{$targetPlayer.shots}</div></li>
                <li class="assists-val"><div>{$targetPlayer.assists}</div></li>
                <li class="saves-val"><div>{$targetPlayer.saves}</div></li>
            </div>
        </div>
    {/if}
{:else}
        <div style="display: none;"></div>
{/if}

<style>
    .b-stats {
        width: 710px;
        height: 190px;
        /* border-bottom-left-radius: 20%;
        border-bottom-right-radius: 20%; */
        /* background-color: #000; */
        background-image: url('../assets/RLSS_Stat_Box.png');
        background-position: 52% 43%;
        background-size: 970px 500px;
        bottom: -30px;
        left: -24px;
        position: absolute;
        /* box-shadow: 5px 5px 8px 0px rgba(0,0,0,0.9); */
    }

    .o-stats {
        width: 710px;
        height: 190px;
        /* border-bottom-left-radius: 20%;
        border-bottom-right-radius: 20%; */
        /* background-color: #000; */
        background-image: url('../assets/RLSS_Stat_Box_O.png');
        background-position: 52% 43%;
        background-size: 970px 500px;
        bottom: -30px;
        left: -24px;
        position: absolute;
        /* box-shadow: 5px 5px 8px 0px rgba(0,0,0,0.9); */
    }

    .b-name {
        position: absolute;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 30px;
        left: 276px;
        width: 150px;
        height: 60px;
        /* background-color: rgba(128, 128, 128, 0.404); */
        /* border-radius: 5px; */
        border-bottom-left-radius: 20%;
        border-bottom-right-radius: 20%;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 0 5px #000000, 0 0 5px #000000, 0 0 5px #000000;
        transition: font-size 0.3s ease, width 0.3s ease;
        font-family: "Exo 2", sans-serif;
    }

    .o-name {
        position: absolute;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 30px;
        left: 276px;
        width: 150px;
        height: 60px;
        /* background-color: rgba(128, 128, 128, 0.404); */
        /* border-radius: 5px; */
        border-bottom-left-radius: 20%;
        border-bottom-right-radius: 20%;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 0 5px #000000, 0 0 5px #000000, 0 0 5px #000000;
        transition: font-size 0.3s ease, width 0.3s ease;
        font-family: "Exo 2", sans-serif;
    }

    .player-name-s {
        font-size: 24px;
    }

    .player-name-m {
        font-size: 22px;
    }

    .player-name-l {
        font-size: 20px;
    }

    .mvp-badge {
        position: absolute;
        left: 214px;
        margin-left: 7px;
        color: rgb(255, 255, 255);
        padding: 4px 8px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bold;
        text-shadow: none;
        text-shadow: 0 0 5px #000, 0 0 10px #000, 0 0 15px #000, 0 0 20px #fff, 0 0 5px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;
    }

    .category {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 600px;
        top: 104px;
        left: 50px;
        font-size: 16px;
        font-weight: bold;
        /* color: #000; */
        text-shadow: 0 0 5px #000, 0 0 10px #000, 0 0 10px #000;
        font-family: "Exo 2", sans-serif;
    }
    
    .value {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 600px;
        left: 50px;
        top: 122px;
        font-size: 20px;
        font-weight: bold;
        /* color: #000; */
        text-shadow: 0 0 5px #000, 0 0 10px #000, 0 0 10px #000;
        font-family: "Pacifico", sans-serif;
    }

    li {
        list-style-type: none;
        position: relative;
        margin: auto;
        width: 50px;
        
    }
</style>