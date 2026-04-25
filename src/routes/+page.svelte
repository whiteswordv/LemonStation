<script lang="ts">
    import Tabs from "$lib/Tabs.svelte";
    import { type Tab } from "$lib/Tabs.svelte";

    let tabs: Tab[] = $state([]);
    let currentIndex = $state(0);
</script>

{#snippet loadWarning(warning: string)}
    <div id="warning-container">
        <p>{warning}</p>
    </div>
{/snippet}

<main>
    <Tabs bind:tabs bind:currentIndex></Tabs>
</main>

<style>
    :root {
        background-color: var(--bg-color);
        margin: 0%;

        --bg-color: rgb(6, 10, 11);
        --fg-color: rgb(14, 26, 31);
        --tab-color: rgb(26, 43, 50);
        --border-color: rgb(0, 255, 149);
        --border-exit-color: rgb(255, 30, 90);

        --text-color: rgb(237, 255, 245);
    }

    @font-face {
        font-family: Nunito;
        src: url("src/lib/assets/fonts/Nunito/static/Nunito-Black.ttf");
    }
</style>
