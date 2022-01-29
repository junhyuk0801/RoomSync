<script>
    export let name, callback;
</script>

<style>
        .crawler {
        display: flex;
        position: sticky;
        align-items: center;
        justify-content: space-between;
        width: 15em;
        height: 5em;
        background-color: #b3fdb9;
        border-bottom: 1px solid #1b1b1b;
    }

    .crawler:hover {
        background-color: #e2ffe4;
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

<div class="crawler" on:click={async () => { await callback(name) }}>
    <div class="title">쿠팡</div>
    <div class="arrow-right"></div>
</div>
