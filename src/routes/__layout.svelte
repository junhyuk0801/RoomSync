<script>
    import Nav from "../components/navBar.svelte"
</script>
<svelte:head>
    <title>쿠팡 동기화 설정</title>
    <style>
        body {
            position: relative;
            font-family: "맑은고딕", "Malgun Gothic", "dotum", "gulim", sans-serif;
            background-color: #F5F5F5;
            margin: 0px;
        }
        
        a:link { color: #666666; text-decoration: none;}
        a:visited { color: black; text-decoration: none;}
    </style>
</svelte:head>
<Nav/>
<div>
    <slot></slot>
</div>