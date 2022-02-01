<script>
    import { CRAWLERNAME } from "../stores/resortList";
    export let name, callback;

</script>

<style>
    .crawler {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: space-between;
        width: 15em;
        height: 5em;
        background-color: #ffdcc7;
        border-bottom: 1px solid #1b1b1b;
    }

    .crawler:hover {
        background-color: #fff6f1;
    }

    .title {
        margin-left: 2em;
        font-size: 1.5em;
    }

    .arrow-right {
        width: 0; 
        height: 0; 
        margin-right: 1em;
        border-top: 0.5em solid transparent;
        border-bottom: 0.5em solid transparent;
        border-left: 0.5em solid #1b1b1b;
    }


</style>

<div class="crawler" on:click={() => {callback(name)}}>
    <div class="title">{$CRAWLERNAME[name]}</div>
    <div class="arrow-right"></div>
</div>
