<script context="module">
    export async function load() {
        const url = `http://localhost:3001/requests/crawlerconfig/`;
        const data = await fetch(url).then(res => res.json());  
        return {props: {data}}
    }
</script>
<script>
    import Option from "../components/options.svelte";
    import Modal from "../components/modal.svelte"
    import {CRAWLERNAME} from "../stores/resortList"
import { add_styles } from "svelte/internal";
        
    export let data;
    let resortList = Object.keys(data);

    let selectedResort = "all";
    let selectedItem = [];
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

    let filteredItem = [];
    let searchedTerm = "";
    function search(term) {
        if(term) {
            filteredItem = selectedItem.filter((v) => {
                return v.name.includes(term);
            });
        } else {
            filteredItem = selectedItem;
        }
    }
    
    let show = false;
    let msg = "";
    
    let selectResort = false;
    let addingItem = "Hanhwa";
    function addItem() {
        selectResort = false;
        let randstr = Math.random().toString(36).substr(2,11);
        data[addingItem][randstr] = {
            temp: { temp: { resortType: "tmp", roomType: "tmp" } }
        };
        select(selectedResort); search(searchedTerm);

        fetch("http://localhost:3001/requests/crawlerconfig/", {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(data)
        });
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
        fetch("http://localhost:3001/requests/crawlerconfig/", {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(data)
        }).then((v) => {
            msg = `${CRAWLERNAME[type]} ${resortName} 설정이 저장되었습니다`;
            show = true;
        });
    }

    f.remove = function(type, resortName) {
        if(confirm("진짜 지워요?")) {
            delete data[type][resortName];`
            `
            fetch("http://localhost:3001/requests/crawlerconfig/", {
                headers: { 'Content-Type': 'application/json', },
                method: "POST",
                body: JSON.stringify(data)
            });

            select(selectedResort); search(searchedTerm);
        }
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
        background-color: #FFFFFF;
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

    .addnew {
        display: flex;
        font-size: 1.3em;
        background-color: #CCFFFF;
        border-bottom: 1px solid black;
        margin: 0.3em;
        border-radius: 0.1em;
        border: 1px solid #5B5B5B;
        box-shadow: 0.1em 0.1em 0.1em lightgray;
        padding: 1.4em;
        justify-content: center;
    }

    .addnew:hover {
        background-color: #EEFFFF;
    }

    .addnew:active {
        background-color: #FFFFFF;
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
        <div class="addnew" on:click={() => selectResort = true}>
            추가
        </div>
    </div>
</div>

{#if show}
    <Modal on:close="{() => show = false}">
        {msg}
    </Modal>
{/if}

{#if selectResort}
    <Modal on:close={addItem}>
        <select class="select" bind:value={addingItem}>
            {#each resortList as resort}
                <option value={resort}>{$CRAWLERNAME[resort]}</option>
            {/each}
        </select><br>
        추가하실 리조트 종류를 골라주세요
    </Modal>
{/if}