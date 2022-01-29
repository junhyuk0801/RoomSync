<script>
    import {fade} from "svelte/transition"
    import Crawler from "../components/crawler.svelte";
    import Coupang from "../components/coupang.svelte";
    import Modal from "../components/modal.svelte";

    const CRAWLERNAME = {
        "Daemyung" : "대명리조트",
        "Hanhwa" : "한화리조트",
        "Coupang" : "쿠팡"
    }

    let show = false;
    let msg = "";
    let showEffect = false;
    let currentShow = "";
    let startDate;
    let endDate;
    let lastCrawl;
    let interval;
    let cookie;

    let showCrawler = async function(crawler) {
        let CrawlerInfo = await fetch("http://192.168.0.4:3001/requests/home")
        .then((res) => res.json());
        currentShow = crawler;

        showEffect = true;
        setTimeout(() => {
            showEffect = false;
        }, 1);

        lastCrawl = CrawlerInfo[crawler].lastCrawl;
        interval = CrawlerInfo[crawler].interval;
        if(crawler === "Coupang") {
            cookie = CrawlerInfo[crawler].cookie;
        } else {
            startDate = CrawlerInfo[crawler].startDate;
            endDate = CrawlerInfo[crawler].endDate;
        }
    }

    let sendData = function() {
        let data = {};
        if(currentShow === "Coupang") 
            data = {interval, cookie};
        else 
            data = {startDate, endDate, interval};

        fetch("http://192.168.0.4:3001/requests/home/" + currentShow, {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(data)
        }).then((v) => {
            msg = `${CRAWLERNAME[currentShow]} 설정이 저장되었습니다`;
            show = true;
        });
    } 

</script>
<style>
    .contents { 
        display: flex;
    }

    .crawlers {
        position: fixed;
        display: block;
        background: white;
        flex-direction: column;
        border-left: 1px solid black;
        height: calc(100vh - 5em);
        overflow-y: scroll;
    }

    .crawlerInfo { 
        display: flex;
        position: relative;
        margin-left: 18em;
        margin-top: 1em;
        padding: 2em;
        flex-direction: column;
        background-color: #FFFFFF;
        border-radius: 2em;
        width: 94em;
        height: 45em;
        box-shadow: 1em 1em 1em lightgray;
        border: 2px solid lightgray;
    }

    .crawlerInfo2 { 
        display: flex;
        position: absolute;
        margin-left: 18em;
        margin-top: 1em;
        padding: 2em;
        background-color: #FFFFFF;
        border-radius: 2em;
        width: 94em;
        height: 45em;
        box-shadow: 1em 1em 1em lightgray;
        border: 2px solid lightgray;
        z-index: 900;
    }

    .title {
        margin: 0;
        margin-left: 1em;
        margin-bottom: 0.5em;
        font-size: 3em;
        font-weight: 600;
    }

    .crawlerInfo table {
        font-size: 1.1em;
        border-collapse: separate;
        border-spacing: 2rem 0;
        width: 40em;
    }

    .crawlerInfo table tr {
        height: 3.5em;
    }

    .first {
        text-align: left;
        width: 12em;
    }

    .crawlerInfo input {
        font-size: 1em;
    }

    .crawlerInfo button {
        display: flex;
        position: absolute;
        bottom: 3em;
        left: 10em;
        width: 7em;
        height: 4em;
        background-color: #FFCCAA;
        border: 1px #FFBB88 solid;
        border-radius: 0.2em;
        box-shadow: 0.1em 0.1em 0.2em lightgray;
        font-size: 1.4em;
        align-items: center;
        justify-content: center;
    }
    
    .crawlerInfo button:hover {
        background-color: #FFDDBB;
    }

    .crawlerInfo button:active {
        background-color: #FFFFFF;
    }

</style>

<div class="contents">
    <div class="crawlers">
        <Coupang name="Coupang" callback={showCrawler}/>
        <Crawler name="Daemyung" callback={showCrawler}/>
        <Crawler name="Hanhwa" callback={showCrawler}/>
    </div>
    {#if showEffect}
    <div class="crawlerInfo2" out:fade></div>
    {/if}
    <div class="crawlerInfo">
        <p class="title">{currentShow ? CRAWLERNAME[currentShow] : ""}</p>
        <table>
        {#if currentShow == ""}
            <tr><td></td></tr>
        {:else if currentShow == "Coupang"}
            <tr><td class="first">마지막 크롤링 시간</td><td>{lastCrawl}</td></tr>
            <tr><td class="first">업로드 간격(분)</td><td><input bind:value={interval}></td></tr>
            <tr><td class="first">쿠키</td><td><input style="width:20em" bind:value={cookie}></td></tr>
            <button on:click={sendData}>전송</button>
        {:else}
            <tr><td class="first">탐색 시작일</td><td><input bind:value={startDate}></td></tr>
            <tr><td class="first">탐색 종료일</td><td><input bind:value={endDate}></td></tr>
            <tr><td class="first">마지막 크롤링 시간</td><td>{lastCrawl}</td></tr>
            <tr><td class="first">업로드 간격(분)</td><td><input bind:value={interval}></td></tr>
            <button on:click={sendData}>전송</button>
        {/if}
        </table>
    </div>
</div>

{#if show}
    <Modal on:close="{() => show = false}">
        {msg}
    </Modal>
{/if}