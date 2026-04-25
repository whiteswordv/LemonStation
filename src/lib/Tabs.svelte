<script lang="ts">
    import Motors from "./Motors.svelte";

    export interface Tab {
        id: string;
        title: string;
    }

    let {
        tabs = $bindable(),
        currentIndex = $bindable(),
    }: {
        tabs: Tab[];
        currentIndex: number;
    } = $props();
</script>

<div class="tab-container">
    {#each tabs as tab, index (tab.id)}
        <div id="tab-wrapper">
            <button
                id="open-button"
                onclick={() => (currentIndex = index)}
                aria-label="ah">{tab.title}</button
            >
            <button
                id="close-button"
                onclick={() => tabs.splice(index, 1)}
                aria-label="ah">X</button
            >
        </div>
    {/each}
</div>

<div id="tab-utils">
    <button
        id="add-button"
        onclick={() => {
            const newTab: Tab = {
                id: crypto.randomUUID(),
                title: "Home",
            };

            tabs.push(newTab);
        }}
    >
        +
    </button>

    <button id="clear-button" onclick={() => (tabs = [])}> Clear </button>
</div>

<div class="page">
    {#each tabs as tab, index (tab)}
        {#if currentIndex == index}
            <Motors></Motors>
        {/if}
    {/each}
</div>

<style>
    .tab-container {
        font-family: Nunito;
        background-color: var(--fg-color);
        position: relative;

        margin-bottom: auto;
        margin-top: 0;

        overflow-x: scroll;

        display: flex;
        flex-direction: row;

        padding: 0.5vh;
        gap: 0.5vw;

        button {
            font-family: Nunito;
            color: var(--text-color);
            background-color: var(--tab-color);
            padding: 1vh;
            border: none;
            transition: 0.1s;
        }

        button:active {
            color: var(--fg-color);
        }
    }

    #tab-wrapper {
        font-family: Nunito;
        display: flex;
        flex-direction: row;
        background-color: var(--tab-color);
        padding: 2px;
        border-radius: 5px;
    }

    #tab-utils {
        font-family: Nunito;
        display: flex;
        flex-direction: row;
        position: relative;
    }

    #open-button:active {
        background-color: var(--border-color);
        border-radius: 5px;
    }

    #close-button:active {
        background-color: var(--border-exit-color);
        border-radius: 5px;
    }

    #add-button {
    }

    #clear-button {
    }
</style>
