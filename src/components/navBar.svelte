<script>
    const navItems = [
        {name: "홈", href: "/"},
        {name: "크롤러 설정", href: "/crawler-config"},
        {name: "쿠팡 설정", href: "/coupang-config"},
    ]
</script>

<style>
    .navbar {
        position: relative;
        display: flex;
        height: 5em;
        box-shadow: 1em 0em 0.5em lightgray;
        align-items: center;
    }

    .navbar img {
        position: absolute;
        left: 3em;
    }

    .navitems {
        display: flex;
        max-width: 100em;
        width: 100%;
        justify-content: flex-start;
        margin-left: 20em;
    }

    .navitem {
        font-size: 1.4em;
        text-align: center;
        display: block;
        width: 8em;
        color: #666666;
        font-weight: bold;
    }
    .navitem a:visited { color: #666666; }
    .navitem a:hover { color: #BBBBBB; }
</style>

<div class="navbar">
    <img src="/logogogoo.png" alt="logo">

    <div class="navitems">
        {#each navItems as item}
            <div class="navitem">
                <a href={item.href}> {item.name} </a> 
            </div>
        {/each}
    </div>
</div>
