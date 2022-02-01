<script context="module">
    export async function load() {
        // const url = `http://localhost:3001/requests/crawlerconfig/`;
        // const data = await fetch(url).then(res => res.json());
        
        const data = {};
        return {props: {data}}
    }
</script>
<script>
    import {CRAWLERNAME} from "../stores/resortList";
    export let data;
    let selectedResort = "all";
    let selectedItem = [];
    let filteredItem = [];
    let searchedTerm = "";
    let resortList = Object.keys(data);
    let show = false;
    let msg = "";

</script>
<style>
        .contents { 
        display: flex;
        padding: 3em;
        flex-direction: column;
        align-items: center;
    }

    .select {
        font-size: 1.2em;
        border-radius: 1em;
        padding: 1em;
        border: 2px darkgray solid;
    }

    .search {
        width: 30em;
        border-radius: 1em;
        font-size: 1.2em;
        padding: 1em;
        border: 2px darkgray solid;
        margin-left: 1em;
    }

    .options {
        display: flex;
        flex-direction: column;
        background-color: white;
        width: 100em;
        height: 41em;
        margin-top: 2em;
        overflow-y: scroll;
        overflow-x: hidden;
        border: 2px solid darkgray;
    }
</style>

<div class="contents">
    <div>
        <select class="select" bind:value={selectedResort}>
            <option value="all">전체</option>
            {#each resortList as resort}
                <option value={resort}>{$CRAWLERNAME[resort]}</option>
            {/each}
        </select>
        <input class="search" placeholder="검색" bind:value={searchedTerm}>
    </div>
    <div class="options">
        {#each filteredItem as item}
            <Option {item} {f}/>
        {/each}
    </div>
</div>