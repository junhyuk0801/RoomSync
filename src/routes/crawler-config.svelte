<script context="module">
    export async function load() {
        const url = `http://192.168.0.4:3001/requests/crawlerconfig/`;
        const data = await fetch(url).then(res => res.json());  
        return {props: {data}}
    }
</script>
<script>
    import Option from "../components/options.svelte";
    import Modal from "../components/modal.svelte"

    const CRAWLERNAME = {
        "Daemyung" : "대명리조트",
        "Hanhwa" : "한화리조트",
    }
        
    export let data;
    let selectedResort = "all";
    let selectedItem = [];
    let filteredItem = [];
    let searchedTerm = "";
    let resortList = Object.keys(data);
    let show = false;
    let msg = "";
    
    function select(type) {
        selectedItem = resortList.reduce((acc, cur) => {
            return acc.concat(
                Object.keys(data[cur]).map(v => {
                    return {
                        type: cur,
                        name: v,
                        data: data[cur][v]
                    };
                }).filter(v => {
                    return type === "all" || v.type === type;
                })
            );
        }, []);
    }

    function search(term) {
        if(term) {
            filteredItem = selectedItem.filter((v) => {
                return v.name.includes(term);
            });
        } else {
            filteredItem = selectedItem;
        }
    }

    $: { select(selectedResort); search(searchedTerm); }
    $: search(searchedTerm);

    let f = {};
    f.inspect = function (type, before, resortName) { 
        if (before !== resortName)
            for(let dd of Object.keys(data[type]))
                if (dd === resortName)
                    return false;
        return true;
    }

    f.submit = function (type, resortName, resortNameChanged, d) {
        if (resortName !== resortNameChanged) {
            delete data[type][resortName]
        }

        data[type][resortNameChanged] = d;
        fetch("http://192.168.0.4:3001/requests/crawlerconfig/", {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(data)
        }).then((v) => {
            msg = `${CRAWLERNAME[type]} ${resortName} 설정이 저장되었습니다`;
            show = true;
        });
    }
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
                <option value={resort}>{CRAWLERNAME[resort]}</option>
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

{#if show}
    <Modal on:close="{() => show = false}">
        {msg}
    </Modal>
{/if}