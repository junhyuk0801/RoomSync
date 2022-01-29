<script>
    export let text;
    export let size = "1em";
    export let onchange;

    let renaming = false;
    let memory = text;

    function change(e) {
        if(e.keyCode == 13) {
            let changed = e.target.value.trim();
            if(onchange(memory, changed)) {
                text = memory = changed;
                renaming = false;
            }
        }
    }

</script>
<style>
    .modifyBtn {
        background-color: white;
        border: 1px solid #CC9966;
    }

    .modifyEntry {
        text-align: center;
        width: fit-content;
    }
</style>

<div>
    {#if renaming}
        <input class="modifyEntry" style="font-size: {size};" value={text} on:keydown={(e) => change(e)}>
    {:else}
        <span style="font-size: {size};">{text}</span>
        <button class="modifyBtn" on:click={() => {renaming = true;}}>수정</button>
    {/if}
</div>
