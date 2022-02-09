<script>
    import Renamable from "../components/renamable.svelte"
    import {CRAWLERNAME} from "../stores/resortList"
    export let item, f;

    let origin = item.name;
    let show = false;
    let displayed = Object.keys(item.data);

    function resortNameChange(before, after) {
        let res = f.inspect(item.type, before, after);
        if(!res) alert("중복");
        else item.name = after;
        return res;
    }

    function resortTypeChange(before, after) {
        if (before !== after) {
            for(let dd of Object.keys(item.data))
                if(dd === after) {
                    alert("중복");
                    return false;
                }

            delete Object.assign(item.data, {[after]: item.data[before] })[before];
            displayed = Object.keys(item.data);
        }
        return true;
    }

    function roomTypeChange(before, after, resortname) {
        if (before !== after) {
            for(let dd of Object.keys(item.data[resortname]))
                if(dd === after) {
                    alert("중복");
                    return false;
                }

            delete Object.assign(item.data[resortname], {[after]: item.data[resortname][before] })[before];
            displayed = Object.keys(item.data);
        }
        return true;
    }

    function roomDataChange(before, after, resortname, roomname, kind) {
        if (before !== after) {
            item.data[resortname][roomname][kind] = after;
            displayed = Object.keys(item.data);
        }

        return true;
    }

    function addResort() {
        let randstr = Math.random().toString(36).substr(2,11);
        item.data[randstr] = { temp : { resortType: "tmp", roomType: "tmp" } };
        displayed = Object.keys(item.data);
    }

    function addRoom(resort) {
        let randstr = Math.random().toString(36).substr(2,11);
        item.data[resort][randstr] = { resortType: "tmp", roomType: "tmp" }
        displayed = Object.keys(item.data);
    }

    function deleteResort(resort) {
        if( confirm("진짜 지워요?") ) {
            delete item.data[resort];
            displayed = Object.keys(item.data);
        }
    }

    function deleteRoom(resort, room) {
        if( confirm("진짜 지워요?") ) {
            delete item.data[resort][room];
            displayed = Object.keys(item.data);
        }
    }

    function submit() {
        f.submit(item.type, origin, item.name, item.data);
    }
</script>
<style>
    .option_ {
        background-color: #FFFFB5;
        border-bottom: 1px solid black;
        margin: 0.3em;
        border-radius: 3em;
        border: 1px solid #5B5B5B;
        box-shadow: 0.1em 0.1em 0.1em lightgray;
    }

    .option_:hover {
        background-color: #FFFFD5;
    }

    .option {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        background-color: #DDFFDD;
        border-bottom: 1px solid black;
        margin: 0.3em;
        border-radius: 3em;
        border: 1px solid #5B5B5B;
        box-shadow: 0.1em 0.1em 0.1em lightgray;
    }

    .type {
        padding: 1.4em;
        padding-left: 1.9em;
        font-size: 1.5em;
        border-right: 1px solid #5B5B5B;
        margin: 0px;
    }
    
    .title {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: flex-start;
    }

    .name {
        margin-left: 1.4em;
        font-size: 1.5em;
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 4em;
        margin-left: 3em;
        width: 100%;
    }

    .resortTitle {
        display: flex;
        width: calc(100% - 20em);
        justify-content: space-between;
        margin-bottom: 0.2em;
    }

    .info hr {
        width: calc(100% - 6em);
        margin-left: -0.5em;
        border: 1px solid #99DD99;
    }

    .info table {
        border-collapse: separate;
        border-spacing: 0 0;
        width: 80em;
        border: 1px solid black;
    }

    .info table tr {
        height: 2em;
    }

    .info table td {
        border: 1px solid black;
    }

    .header { 
        text-align: center;
        font-size: 1.3em;
        font-weight: 600;
    }

    .submit {
        margin-top: 1em;
        margin-top: 0.3em;
        width: 6em;
        height: 3em;
        font-size: 2em;
        border-radius: 0.5em;
        background-color: #66BB66;
        box-shadow: 0.1em 0.1em 0.1em lightgray;
        color: white;
        border: none;
    }

    .submit:hover {
        background-color: #99DD99;
    }

    .submit:active {
        background-color: #AAFFAA;
    }

    .close {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2em;
        font-size: 1em;
        width: 92em;
    }

    .close:hover {
        background-color: #eeffee;
    }

    .removewhole {
        position: absolute;
        top: 1em;
        right: 4em;
        font-size: 1.1em;
    }

    .remove {
        display: flex;
        position: relative;
        border: 1px solid black;
        padding: 0.5em;
        background-color: #FFBBBB;
        border-radius: 1em;
        box-shadow: 0.1em 0.1em 0.1em lightgray;
        width: fit-content;
    }

    .remove:hover {
        background-color: #FFDDDD;
    }

    .removecell {
        width: fit-content;
    }

    .additem {
        width: 100%;
        border: 1px solid #99EEEE;
        border-radius: 1em;
        text-align: center;
        background-color: #CCFFFF;
    }

    .additem:hover {
        background-color: #DDFFFF;
    }

    .additem:active {
        background-color: #FFFFFF;
    }

    .addresort {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        width: calc(100% - 30em);
        height: 4em;
        border: 1px solid #99EEEE;
        border-radius: 1em;
        background-color: #CCFFFF;
    }

    .addresort:hover {
        background-color: #DDFFFF;
    }

    .addresort:active {
        background-color: #FFFFFF;
    }

</style>

{#if show}
<div class="option">
    <div class="removewhole">
        <div class="remove" on:click={() => { show = false; f.remove(item.type, item.name); }}>삭제</div>
    </div>
    <div class="info">
        <Renamable text={item.name} size="3em" onchange={resortNameChange}/>
        <hr>
        {#each displayed as opt}
            <div class="resortTitle">
                <Renamable text={opt} size="1.8em" onchange={resortTypeChange}/>
                <div class="remove" on:click={() => { deleteResort(opt); }}>삭제</div>
            </div>
            <table>
                <tr class="header">
                    <td>사이트 기준 객실명</td>
                    <td>변환후 리조트명</td>
                    <td>변환후 객실명</td>
                    <td></td>
                </tr>
                {#each Object.keys(item.data[opt]) as rooms}
                    <tr>
                        <td><Renamable text={rooms} size="1.0em" onchange={(before, after) => roomTypeChange(before, after, opt)}/></td>
                        <td><Renamable text={item.data[opt][rooms].resortType} size="1.0em" onchange={(before, after) => roomDataChange(before, after, opt, rooms, "resortType")}/></td>
                        <td><Renamable text={item.data[opt][rooms].roomType} size="1.0em" onchange={(before, after) => roomDataChange(before, after, opt, rooms, "roomType")}/></td>
                        <td class="removecell">
                            <div class="remove" on:click={() => { deleteRoom(opt, rooms); }}>삭제</div>
                        </td>
                    </tr>
                {/each}
                <tr><td colspan=4>
                    <div class="additem" on:click={() => addRoom(opt)}>+</div>
                </td></tr>
            </table>
            <hr>
        {/each} 
    </div>
    <div class="addresort" on:click={() => addResort()}>+</div>
    <hr>
    <button class="submit" on:click={submit}>저장</button>
    <div class="close" on:click={() => { show = false; }}>
        ▲
    </div>
</div>
{:else}
<div class="option_" on:click={() => { show = true; displayed = Object.keys(item.data); }}>
    <div class="title">
        <div class="type">{$CRAWLERNAME[item.type]}</div>
        <div class="name">{item.name}</div>
    </div>
</div>
{/if}